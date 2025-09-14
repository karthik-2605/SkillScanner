import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Header() {
  const [selectedFile, setselectedFile] = useState(null);
  const [loading, setLoading] = useState(false); // ⬅️ NEW
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setselectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please choose a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      setLoading(true); // ⬅️ start loading
      const response = await axios.post(
        "http://localhost:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server response: ", response.data);

      // ⬅️ Wait 1 sec to show loading, then navigate
      setTimeout(() => {
        setLoading(false);
        navigate("/dashboard", { state: response.data });
      }, 1000);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Something went wrong during the upload.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="header_section">
        <div className="heading">
          <h1>Upload Your Resume</h1>
          <h1 className="heading_2">Find your perfect Job Match</h1>
          <p>
            Leverage AI powered analysis to discover your ideal career path. Get
            Instant job role predictions and find matching opportunities.
          </p>
        </div>

        <div className="upload_section">
          <div className="upload_image">
            <i className="fa-solid fa-upload"></i>
          </div>

          <div className="upload_layout">
            <div className="upload_heading">
              <h2>Upload your Resume</h2>
              <p>Drag and drop your resume file here, or click to browse</p>
            </div>

            <div className="upload_button">
              <button onClick={handleChooseFile}>Choose File</button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>

            {selectedFile && (
              <div className="file_preview">
                <p>
                  Selected File: <strong>{selectedFile.name}</strong>
                </p>
              </div>
            )}

            <div className="upload_final_section">
              <p>Supported formats: PDF, DOCX (Max 10MB)</p>
            </div>

            <div className="upload_final_button">
              <button onClick={handleUpload} disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
              </button>
            </div>

            {loading && (
              <p style={{ color: "blue" }}>
                Uploading your file, please wait...
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
