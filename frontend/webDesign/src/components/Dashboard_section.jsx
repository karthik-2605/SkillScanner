import Job_post from "./Job_post.jsx";
import {useLocation} from "react-router-dom";
export default function Dashboard_section() {
  const location = useLocation();
  const {matching_jobs,prediction} = location.state || {};
  return (
    <>
      <div className="dashboard_container">
        <div className="dashboard_heading">
          <h2>Resume Analysis Dashboard</h2>
          <p>Your resume has been analyzed. Here are the results: </p>
        </div>

        <div className="resume">
          <div className="resume_left">

            <div className="matching_jobs">
              <h2>Matching Jobs</h2>
              <div className="matching_jobs_info">
                <div className="matching_jobs_section">
                    <Job_post jobs_list={matching_jobs || []}/>  {/* 1st change for posting jobs*/}
                </div>
                
              </div>
            </div>
          </div>

          <div className="resume_right">
            <div className="prediction_result">
              <div className="prediction_result_container_1">
                <i class="fa-solid fa-arrows-to-circle"></i>
                <h2>Prediction Result</h2>
              </div>

              <div className="prediction_result_container_2">
                <i class="fa-solid fa-star"></i>
                <p>Predicted Job Role:</p>
                <h3>{prediction.prediction || "Not found"}</h3>
              </div>

              <div className="prediction_result_container_3">
                <p>{(prediction.confidence*100).toFixed(2)}% Confidence Score </p>
              </div>
            </div>

            <div className="analysis">
              <h2>Analysis Stats</h2>
              <div className="analysis_description">
                <p><span>Job matches: </span> 5</p>
                <p><span>Best Match: </span>{((prediction.confidence*100).toFixed(2)) || "NaN"}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
