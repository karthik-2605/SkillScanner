const path = require("path");
const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const mysql = require("mysql2/promise");
const {exec} = require("child_process");

const app = express();
const PORT = 8000;

app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: // ***** password ****** //,
  database: "skillScanner",
});

app.use(express.static(path.join(__dirname, "../frontend/webDesign/dist")));




const upload = multer({ dest: "uploads/" });

// ADD JOB ROUTES
app.post("/add-job", async (req, res) => {
  try {
    const { job_title, company, category, location, job_info } = req.body;
    if(!job_title || !company || !category || !location || !job_info){
      return res.status(400).json({error:"Please fill the details!"});
    }
    await db.query(
      "INSERT INTO jobs (job_title,company,category,location,job_info) VALUES (?,?,?,?,?)",
      [job_title, company, category, location, job_info]
    );

    const pythonPath = path.join(__dirname,"../ml-service/venv/bin/python");

    const scriptPath = path.join(__dirname,"../ml-service/train_model.py");

    exec(`${pythonPath} "${scriptPath}"`,(error, stdout,stderr)=>{
      if(error){
        console.error(`Error training model: ${error.message}`);
      }

      if(stderr){
        console.error( `Stderr: ${stderr}`);
      }

      console.log(`Model retrained : ${stdout}`);
    })

    res.json({ success: true, message: "job added successfully" });
  } catch (err) {
    console.log("DB insert error: ", err.message);
    res.status(500).json({ error: "Failed to add job" });
  }
});

// FETCH ALL JOBS
app.get("/jobs", async (req, res) => {
  try {
    const [results] = await db.query(
      "SELECT * FROM jobs ORDER BY created_at DESC"
    );
    res.json(results);
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ error: "Database error" });
  }
});

// DELETE A JOB BASED ON ID
app.delete("/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM jobs WHERE id = ?", [id]);
    res.json({ message: "Job deleted successfully!" });
  } catch (err) {
    console.log("error: ", err);
    res.status(500).json({ error: "Database error" });
  }
});


// UPDATE A JOB BASED ON ID
app.put("/jobs/:id",async (req,res)=>{
  try{
    const {id} = req.params;
    const {job_title, company, category , location, job_info} = req.body;

    await db.query("UPDATE jobs SET job_title=?,company=?,category=?,location=?,job_info=? WHERE id = ?",[job_title,company,category,location,job_info,id]);

    res.json({message:"Updated JOB description successfully"});

  }catch(err){
    console.log("error: ",err);
    res.status(500).json({error:"Database error"});
  }
})





app.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const formData = new FormData();
    formData.append("resume", fs.createReadStream(filePath));

    const response = await axios.post(
      "http://localhost:5001/predict",
      formData,
      {
        headers: formData.getHeaders(),
      }
    );

    const prediction = response.data;
    const topCategories = prediction.top_categories.slice(0,3);
    console.log(topCategories);

    const [jobs] = await db.query(
      `SELECT job_title,company,category,location 
        FROM JOBS
        WHERE category IN (?,?,?)
        LIMIT 5

      `,topCategories
    )

    const finalResponse = {
      prediction,
      matching_jobs : jobs
    }

    res.json(finalResponse);

    // OPTIONAL
    fs.unlink(filePath, (err) => {
      if (err) console.error("Failed to delete uploaded file:", err);
    });
  } catch (error) {
    console.error("❌ Error in /upload:", error.message);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.get(/.*/, (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/webDesign/dist", "index.html")
  );
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
