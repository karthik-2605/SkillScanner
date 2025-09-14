import Container from "./Container.jsx";

export default function Job_categories(){
    return(
        <>
            <div className="categories_section">
                <h1>
                    Supported Job Categories
                </h1>

                <div className="categories">
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "Data Scientist" />
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "Frontend Developer" />
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "Backend Developer" />
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "Full Stack Developer" />
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "DevOps Engineer" />
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "Product Manager" />
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "UI/UX Designer" />
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "Mobile Developer" />

                </div>

            </div>
        </>
    )
}