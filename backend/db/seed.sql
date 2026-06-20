-- Sample job postings. Categories match the labels in the resume dataset
-- (UpdatedResumeDataSet.csv) so model predictions surface matching jobs.
USE skillScanner;

INSERT INTO jobs (job_title, company, category, location, job_info) VALUES
('Data Scientist', 'InsightAI', 'Data Science', 'Bengaluru, IN',
 'Build ML models with Python, pandas, scikit-learn. Experience with statistics, regression and NLP required.'),
('Machine Learning Engineer', 'NeuralWorks', 'Data Science', 'Remote',
 'Design and deploy ML pipelines. Strong Python, TensorFlow/PyTorch and data engineering skills.'),
('Java Backend Developer', 'CoreSystems', 'Java Developer', 'Hyderabad, IN',
 'Develop REST APIs with Java, Spring Boot and Hibernate. Solid OOP and microservices background.'),
('Python Developer', 'Stackline', 'Python Developer', 'Pune, IN',
 'Build backend services in Python with Django/Flask. Familiarity with SQL and REST APIs.'),
('Frontend / Web Developer', 'PixelForge', 'Web Designing', 'Remote',
 'Create responsive UIs with HTML, CSS, JavaScript and React. Eye for clean, accessible design.'),
('DevOps Engineer', 'CloudOps', 'DevOps Engineer', 'Chennai, IN',
 'Manage CI/CD, Docker, Kubernetes and AWS infrastructure. Automate deployments and monitoring.'),
('QA / Test Engineer', 'QualityFirst', 'Testing', 'Mumbai, IN',
 'Write automated and manual tests. Experience with Selenium, test cases and regression testing.'),
('Business Analyst', 'BizBridge', 'Business Analyst', 'Gurugram, IN',
 'Gather requirements, analyze processes and bridge business and engineering teams.'),
('HR Specialist', 'PeopleFirst', 'HR', 'Bengaluru, IN',
 'Manage recruitment, onboarding and employee engagement. Strong communication skills.'),
('Big Data Engineer', 'DataLake', 'Hadoop', 'Remote',
 'Build data platforms with Hadoop, Spark and Hive. Strong distributed systems knowledge.');
