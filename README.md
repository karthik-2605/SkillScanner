# 🧑‍💼 SkillScanner – AI-Powered Resume Analyzer

![Python](https://img.shields.io/badge/Python-3.10-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-Backend-black?style=for-the-badge&logo=flask)
![Express](https://img.shields.io/badge/Express.js-API-lightgrey?style=for-the-badge&logo=express)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql)
![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-orange?style=for-the-badge&logo=scikitlearn)

---

## 📌 Overview
**SkillScanner** is an **AI-powered web application** that analyzes resumes and predicts the most suitable **job categories**.  
It combines **Machine Learning** with a **full-stack architecture** to help students and professionals understand how their resume aligns with various job roles.

---

## ⚡ Features
- 📄 **Upload Resume (PDF)** – extract and preprocess text automatically  
- 🤖 **AI Model (TF-IDF + Naive Bayes)** – classifies resume into job categories  
- 📊 **Top Predictions** – shows confidence score and top-5 job matches  
- 🗂 **Dataset Integration** – trained on Kaggle resumes + MySQL job dataset  
- 🌐 **Frontend (React + CSS)** – user-friendly UI for uploading and viewing results  
- 🔗 **Microservices** – Flask ML service + Express API gateway  

---

## 🏗️ Tech Stack
- **Frontend**: React, Custom CSS (classes & IDs)  
- **Backend**: Node.js (Express), Python (Flask)  
- **Database**: MySQL  
- **ML**: scikit-learn (TF-IDF, Naive Bayes), Pandas, joblib  
- **Others**: Multer (file upload), Axios (API calls)  

---

## 🚀 Project Workflow
```mermaid
flowchart LR
    A[User Uploads Resume] --> B[Express API]
    B --> C[Flask ML Service]
    C --> D[Model (TF-IDF + Naive Bayes)]
    D --> E[Predicted Job Categories + Confidence]
    E --> F[Frontend Displays Results]

