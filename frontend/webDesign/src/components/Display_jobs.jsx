import axios from "axios";
export default function Display_jobs({jobs,fetchJobs,setEditingJob}){

    const handleDelete = async (id) =>{
        if(!window.confirm("Are you sure you want to delete the job?")) return;
        try{
            await axios.delete(`http://localhost:8000/jobs/${id}`);
            fetchJobs();
            
        }catch(err){
            console.log("Error deleteing job: ",err);
        }
    }



    return (
        <>
            <div className="display_jobs_container">
                <h3>Job Listings</h3>
                <table border="1">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Company</th>
                            <th>Category</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>

                    </thead>

                    <tbody>
                        {jobs.map((job,index)=>(
                            <tr key={job.id}>
                                <td>{job.job_title}</td>
                                <td>{job.company}</td>
                                <td>{job.category}</td>
                                <td>{job.location}</td>
                                <td>
                                    <button onClick={()=> setEditingJob(job)}><i class="fa-solid fa-pen-to-square edit"></i></button>
                                    <button onClick={()=>handleDelete(job.id)}><i class="fa-solid fa-trash delete"></i></button>
                                
                                </td>

                            </tr>
                        ))}
                    </tbody>

                </table>

            </div>
        </>
    )
}