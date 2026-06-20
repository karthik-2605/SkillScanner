const path = require("path");
const fs = require("fs");
const { exec } = require("child_process");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 8000;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";

app.use(cors());
app.use(express.json());

// ---- Database pool -------------------------------------------------------
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "skillScanner",
  waitForConnections: true,
  connectionLimit: 10,
});

// ---- File uploads --------------------------------------------------------
const UPLOAD_DIR = path.join(__dirname, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const upload = multer({
  dest: UPLOAD_DIR,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// ---- Optional model retraining ------------------------------------------
// Retraining shells out to the Python service; it's best-effort and never
// blocks the API response. Disable via RETRAIN_ON_ADD=false.
function retrainModel() {
  if (process.env.RETRAIN_ON_ADD === "false") return;

  const pythonBin = process.env.PYTHON_BIN || "python3";
  const scriptPath = path.join(__dirname, "..", "ml-service", "train_model.py");
  const cwd = path.join(__dirname, "..", "ml-service");

  exec(`"${pythonBin}" "${scriptPath}"`, { cwd }, (error, stdout, stderr) => {
    if (error) return console.error(`Retrain failed: ${error.message}`);
    if (stderr) console.error(`Retrain stderr: ${stderr}`);
    console.log(`Model retrained:\n${stdout}`);
  });
}

// ---- Job routes ----------------------------------------------------------
app.post("/add-job", async (req, res) => {
  try {
    const { job_title, company, category, location, job_info } = req.body;
    if (!job_title || !company || !category || !location || !job_info) {
      return res.status(400).json({ error: "Please fill in all the details!" });
    }

    await db.query(
      "INSERT INTO jobs (job_title, company, category, location, job_info) VALUES (?, ?, ?, ?, ?)",
      [job_title, company, category, location, job_info]
    );

    retrainModel();
    res.json({ success: true, message: "Job added successfully" });
  } catch (err) {
    console.error("DB insert error:", err.message);
    res.status(500).json({ error: "Failed to add job" });
  }
});

app.get("/jobs", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM jobs ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Fetch jobs error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/jobs/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM jobs WHERE id = ?", [req.params.id]);
    res.json({ message: "Job deleted successfully!" });
  } catch (err) {
    console.error("Delete job error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/jobs/:id", async (req, res) => {
  try {
    const { job_title, company, category, location, job_info } = req.body;
    await db.query(
      "UPDATE jobs SET job_title=?, company=?, category=?, location=?, job_info=? WHERE id = ?",
      [job_title, company, category, location, job_info, req.params.id]
    );
    res.json({ message: "Job updated successfully" });
  } catch (err) {
    console.error("Update job error:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// ---- Resume upload + prediction -----------------------------------------
app.post("/upload", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No resume file uploaded" });
  }

  const filePath = req.file.path;
  try {
    const formData = new FormData();
    formData.append("resume", fs.createReadStream(filePath));

    const { data: prediction } = await axios.post(
      `${ML_SERVICE_URL}/predict`,
      formData,
      { headers: formData.getHeaders() }
    );

    // Find jobs whose category matches the model's top predictions.
    const categories = prediction.top_categories || [];
    let matching_jobs = [];
    if (categories.length) {
      const placeholders = categories.map(() => "?").join(",");
      const [jobs] = await db.query(
        `SELECT id, job_title, company, category, location
           FROM jobs
          WHERE category IN (${placeholders})
          LIMIT 5`,
        categories
      );
      matching_jobs = jobs;
    }

    res.json({ prediction, matching_jobs });
  } catch (error) {
    console.error("❌ Error in /upload:", error.message);
    res.status(500).json({ error: "Failed to analyze resume" });
  } finally {
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete uploaded file:", err.message);
    });
  }
});

// ---- Serve the built frontend (production) ------------------------------
const distDir = path.join(__dirname, "..", "frontend", "dist");
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get(/.*/, (req, res) => res.sendFile(path.join(distDir, "index.html")));
}

app.listen(PORT, () => {
  console.log(`🚀 API gateway running at http://localhost:${PORT}`);
});
