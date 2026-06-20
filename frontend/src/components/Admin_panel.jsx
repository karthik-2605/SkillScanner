import { useState, useEffect } from "react";
import api from "../api.js";

export default function Admin_panel({ fetchJobs, editingJob, setEditingJob }) {
  const [jobTitle, setjobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (editingJob) {
      setjobTitle(editingJob.job_title);
      setCompany(editingJob.company);
      setLocation(editingJob.location);
      setCategory(editingJob.category);
      setDescription(editingJob.job_info);
      setShowPanel(true);
    }
  }, [editingJob]);

  const handleSaveJob = async () => {
    try {
      if (editingJob) {
        await api.put(`/jobs/${editingJob.id}`, {
          job_title: jobTitle,
          company,
          location,
          category,
          job_info: description,
        });
        alert("Job updated!");
      } else {
        await api.post(`/add-job`, {
          job_title: jobTitle,
          company,
          location,
          category,
          job_info: description,
        });
        alert("Job added!");
      }

      setjobTitle("");
      setCompany("");
      setCategory("");
      setDescription("");
      setLocation("");
      setEditingJob(null);
      setShowPanel(false);

      fetchJobs();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        alert(err.response.data.error);
      } else {
        alert("Something went wrong while adding the job");
      }
      console.log("Error saving job: ", err);
    }
  };

  return (
    <>
      <div className="admin_container">
        <div className="admin_heading">
          <div className="admin_heading1">
            <h2>Admin Panel</h2>
            <p>Manage job postings and categories</p>
          </div>

          <div className="admin_heading2">
            <button onClick={() => setShowPanel(!showPanel)}>
              {showPanel ? "Close" : "+ Add Job"}
            </button>
          </div>
        </div>

        {/* ONLY RENDER IF SHOWPANEL IS TRUE */}

        {showPanel && (
          <div className="add_job_panel">
            <div className="add_job_panel_heading">
              <h3>{editingJob ? "Edit Job" : "Add New Job"}</h3>
            </div>

            <div className="Job_title_company">
              <div className="job_title">
                <h3>Job Title</h3>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setjobTitle(e.target.value)}
                />
              </div>

              <div className="company">
                <h3>Company</h3>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="category_location">
              <div className="category">
                <h3>Category</h3>
                <select
                  name="categories"
                  id="categories"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {/* Values match the labels in the resume dataset so that
                      model predictions can surface matching jobs. */}
                  <option value="">Select Category</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Java Developer">Java Developer</option>
                  <option value="Python Developer">Python Developer</option>
                  <option value="Web Designing">Web Developer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Testing">Testing / QA</option>
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="Hadoop">Big Data / Hadoop</option>
                  <option value="HR">HR</option>
                </select>
              </div>

              <div className="location">
                <h3>Location</h3>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div className="description">
              <h3>Description</h3>
              <textarea
                className="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="buttons_admin">
              <button className="buttons_admin_add_job" onClick={handleSaveJob}>
                {editingJob ? "Update Job" : "Add Job"}
              </button>

              <button
                className="buttons_admin_cancel"
                onClick={() => {
                  setjobTitle("");
                  setCompany("");
                  setCategory("");
                  setLocation("");
                  setDescription("");
                  setEditingJob(null);
                  setShowPanel(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
