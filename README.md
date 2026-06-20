# 🧑‍💼 SkillScanner – AI-Powered Resume Analyzer

![Python](https://img.shields.io/badge/Python-3.10+-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-ML%20Service-black?style=for-the-badge&logo=flask)
![Express](https://img.shields.io/badge/Express.js-API%20Gateway-lightgrey?style=for-the-badge&logo=express)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?style=for-the-badge&logo=mysql)
![scikit-learn](https://img.shields.io/badge/scikit--learn-ML-orange?style=for-the-badge&logo=scikitlearn)

> Upload a resume (PDF) → get the predicted job category, a confidence score,
> the top-5 matches, and real job postings that fit — powered by a
> TF-IDF + Naive Bayes model trained on 960+ labelled resumes.

---

## 📌 Overview

**SkillScanner** is a full-stack, microservices-based web app that analyzes
resumes and predicts the most suitable **job category**. A React frontend talks
to an **Express API gateway**, which routes resume uploads to a **Flask ML
service** and stores job postings in **MySQL**. Predicted categories are matched
against the job database to surface relevant openings.

## ⚡ Features

- 📄 **Upload Resume (PDF)** – text is extracted and preprocessed automatically
- 🤖 **AI Model (TF-IDF + Naive Bayes)** – multi-class resume classification
- 📊 **Top Predictions** – confidence score + top-5 category probabilities
- 🗂 **Dataset Integration** – Kaggle resume dataset + job postings from MySQL
- 🧑‍💻 **Admin Panel** – add / edit / delete job postings (optionally retrains the model)
- 🔗 **Microservices** – Flask ML service + Express API gateway + React SPA

---

## 🏗️ Architecture

```
┌──────────────┐   POST /upload   ┌──────────────┐  POST /predict  ┌──────────────┐
│   React SPA  │ ───────────────► │  Express API │ ──────────────► │  Flask ML    │
│  (frontend)  │ ◄─────────────── │  (backend)   │ ◄────────────── │  (ml-service)│
└──────────────┘   prediction +   └──────┬───────┘   prediction    └──────────────┘
                   matching jobs          │
                                          │ SQL
                                   ┌──────▼───────┐
                                   │    MySQL     │
                                   │   (jobs)     │
                                   └──────────────┘
```

| Service      | Tech                                   | Port | Responsibility                              |
|--------------|----------------------------------------|------|---------------------------------------------|
| `frontend`   | React 19, Vite, Axios                  | 5173 | Upload UI, results dashboard, admin panel   |
| `backend`    | Node.js, Express, Multer, mysql2       | 8000 | API gateway, job CRUD, MySQL access         |
| `ml-service` | Python, Flask, scikit-learn, PyPDF2    | 5001 | PDF parsing + ML prediction + training      |
| `db`         | MySQL 8                                | 3306 | Stores job postings                         |

---

## 📂 Project Structure

```
SkillScanner/
├── docker-compose.yml          # MySQL with schema + seed pre-loaded
├── backend/                    # Express API gateway
│   ├── server.js
│   ├── .env.example
│   ├── db/
│   │   ├── schema.sql          # jobs table
│   │   └── seed.sql            # sample job postings
│   └── uploads/                # temp resume storage (runtime)
├── ml-service/                 # Flask ML microservice
│   ├── app.py                  # /predict + /health endpoints
│   ├── train_model.py          # trains TF-IDF + Naive Bayes model
│   ├── text_preprocessing.py   # lightweight text cleaning
│   ├── requirements.txt
│   ├── .env.example
│   └── data/
│       └── UpdatedResumeDataSet.csv
└── frontend/                   # React + Vite SPA
    ├── src/
    │   ├── api.js              # axios client (VITE_API_URL)
    │   └── components/
    ├── .env.example
    └── package.json
```

---

## 🔧 Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10–3.13
- **Docker** (recommended, for MySQL) — or a local MySQL 8 install

---

## 🚀 Getting Started

Clone the repo, then start the four pieces. Use **four terminals** (one per
service) or background them.

### 1. Database (MySQL via Docker)

```bash
docker compose up -d
```

This starts MySQL on `localhost:3306` and automatically runs
[`schema.sql`](backend/db/schema.sql) and [`seed.sql`](backend/db/seed.sql),
so the `jobs` table is created and populated with sample postings.

<details>
<summary>No Docker? Use a local MySQL instead</summary>

```bash
mysql -u root -p < backend/db/schema.sql
mysql -u root -p < backend/db/seed.sql
```
Then set `DB_PASSWORD` in `backend/.env` and `ml-service/.env` to your root password.
</details>

### 2. ML Service (Flask)

```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate            # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env

python train_model.py               # trains & saves resume_classifier.pkl
python app.py                       # serves on http://localhost:5001
```

> `train_model.py` works **without** a database — it falls back to the CSV
> dataset if MySQL isn't reachable, then folds in any job postings it finds.

### 3. Backend (Express)

```bash
cd backend
npm install
cp .env.example .env
npm run dev                         # serves on http://localhost:8000
```

### 4. Frontend (React)

```bash
cd frontend
npm install
cp .env.example .env
npm run dev                         # serves on http://localhost:5173
```

Open **http://localhost:5173**, upload a PDF resume, and view the prediction. 🎉

---

## 🔌 API Reference (Express gateway)

| Method   | Endpoint      | Description                                            |
|----------|---------------|-------------------------------------------------------|
| `POST`   | `/upload`     | Upload a resume PDF → prediction + matching jobs       |
| `GET`    | `/jobs`       | List all job postings                                  |
| `POST`   | `/add-job`    | Add a job posting (optionally retrains the model)      |
| `PUT`    | `/jobs/:id`   | Update a job posting                                   |
| `DELETE` | `/jobs/:id`   | Delete a job posting                                   |

ML service (`http://localhost:5001`): `POST /predict` (used internally by the
gateway) and `GET /health`.

---

## ⚙️ Configuration

Each service reads its own `.env` (copy from the matching `.env.example`):

| Variable          | Service        | Default                  | Notes                                  |
|-------------------|----------------|--------------------------|----------------------------------------|
| `VITE_API_URL`    | frontend       | `http://localhost:8000`  | Express gateway URL                    |
| `ML_SERVICE_URL`  | backend        | `http://localhost:5001`  | Flask ML service URL                   |
| `DB_*`            | backend + ml   | see `.env.example`       | MySQL host/port/user/password/name     |
| `RETRAIN_ON_ADD`  | backend        | `true`                   | Retrain model when a job is added      |
| `PYTHON_BIN`      | backend        | `python3`                | Python used for retraining             |
| `ML_PORT`         | ml-service     | `5001`                   | Flask port                             |

> **Tip:** to add jobs without triggering retraining (e.g. if the ML venv isn't
> set up), set `RETRAIN_ON_ADD=false` in `backend/.env`.

---

## 🧠 How the Model Works

1. **Preprocessing** ([`text_preprocessing.py`](ml-service/text_preprocessing.py)) —
   lowercase, strip HTML/URLs/punctuation and non-ASCII artifacts.
2. **Vectorization** — `TfidfVectorizer(stop_words="english", max_features=5000)`.
3. **Classifier** — `MultinomialNB` in a scikit-learn `Pipeline`.
4. **Training data** — the Kaggle resume CSV (~960 resumes, 25 categories) plus
   any job postings stored in MySQL.

On the bundled dataset the held-out test accuracy is **~95%**.

---

## 🩺 Troubleshooting

- **`Model not found ... Train it first`** → run `python train_model.py` in `ml-service`.
- **CORS / network errors in the browser** → confirm the backend is on `:8000`
  and `VITE_API_URL` matches.
- **`Failed to add job` / DB errors** → ensure MySQL is up (`docker compose ps`)
  and credentials in `backend/.env` match `docker-compose.yml`.
- **pip build errors on scikit-learn** → use Python 3.10–3.13 (pinned versions
  ship prebuilt wheels for these).

---

## 📜 License

ISC — for educational/portfolio use.
