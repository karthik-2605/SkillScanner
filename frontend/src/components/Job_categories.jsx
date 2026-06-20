import Container from "./Container.jsx";

export default function Job_categories(){
    return(
        <>
            <div className="categories_section">
                <h1>
                    Supported Job Categories
                </h1>

                <div className="categories">
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "Data Science" />
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "Java Developer" />
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "Python Developer" />
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "Web Designing" />
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "DevOps Engineer" />
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "Testing / QA" />
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "Business Analyst" />
                    <Container image = {<i className="fa-solid fa-file"></i>} value = "Big Data / Hadoop" />

                </div>

            </div>
        </>
    )
}