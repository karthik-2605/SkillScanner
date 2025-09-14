export default function Job_post({ jobs_list }) {
  return (
    <>
      {jobs_list && jobs_list.length > 0 ? (
        jobs_list.map((job, index) => (
          <div key={index} className="job_post_container">
            <div className="job_post_heading">
              <h3>{job.job_title || "Not found"}</h3>
              <div className="match_percentage">
                <i className="fa-regular fa-star"></i>
                <p>Matched</p>
              </div>
            </div>

            <div className="job_post_company_location">
              <div className="job_post_company_location_div">
                <i className="fa-regular fa-building"></i>
                <p>{job.company || "Not found"}</p>
              </div>
              <div className="job_post_company_location_div">
                <i className="fa-solid fa-location-dot"></i>
                <p>{job.location || "Not found"}</p>
              </div>
            </div>

            <div className="job_post_date_details">
              <div className="job_post_date_details_btn">
                <button>View Details</button>
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No matching jobs found</p>
      )}
    </>
  );
}
