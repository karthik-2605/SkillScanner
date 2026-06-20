import { useState, useEffect } from "react";
import api from "../api.js";
import Navbar from "./Navbar.jsx";
import Admin_panel from "./Admin_panel.jsx";
import Display_jobs from "./Display_jobs.jsx";

export default function Admin() {
  const [jobs, setJobs] = useState([]);

  const [editingJob, setEditingJob] = useState(null);

  const fetchJobs = async () => {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  };


  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <>
      <Navbar />
      <Admin_panel fetchJobs={fetchJobs} editingJob={editingJob} setEditingJob={setEditingJob} />
      <Display_jobs jobs={jobs} fetchJobs={fetchJobs} setEditingJob={setEditingJob} />
    </>
  );
}
