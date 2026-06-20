"""Train the resume classifier (TF-IDF + Multinomial Naive Bayes).

Data sources:
  1. The Kaggle resume dataset CSV (always used).
  2. Job postings stored in MySQL (optional — used when a DB is reachable).

MySQL is optional so the model can be trained immediately after cloning,
before any database is set up. Configure the DB via environment variables
(see .env.example); if the connection fails, training continues on the CSV
alone and logs a warning.
"""

import os

import joblib
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline

from text_preprocessing import clean_text

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "data", "UpdatedResumeDataSet.csv")
MODEL_PATH = os.path.join(BASE_DIR, "resume_classifier.pkl")


def load_csv_data() -> pd.DataFrame:
    """Load and clean the Kaggle resume dataset."""
    df = pd.read_csv(CSV_PATH)
    df["cleaned_text"] = df["Resume"].apply(clean_text)
    return df.rename(columns={"Category": "category"})[["cleaned_text", "category"]]


def load_db_jobs() -> pd.DataFrame:
    """Load job postings from MySQL. Returns an empty frame if unavailable."""
    empty = pd.DataFrame(columns=["cleaned_text", "category"])
    try:
        import mysql.connector

        conn = mysql.connector.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", "3306")),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "skillScanner"),
            connection_timeout=5,
        )
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT job_title, job_info, category FROM jobs")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()

        if not rows:
            print("ℹ️  No job rows found in MySQL; training on CSV only.")
            return empty

        df = pd.DataFrame(rows)
        df["cleaned_text"] = (
            df["job_title"].astype(str) + " " + df["job_info"].astype(str)
        ).apply(clean_text)
        print(f"✅ Loaded {len(df)} job postings from MySQL.")
        return df[["cleaned_text", "category"]]
    except Exception as exc:  # noqa: BLE001 - any DB issue should be non-fatal
        print(f"⚠️  Skipping MySQL data ({exc.__class__.__name__}: {exc}).")
        print("    Training on the CSV dataset only.")
        return empty


def main() -> None:
    csv_df = load_csv_data()
    db_df = load_db_jobs()

    combined = pd.concat([csv_df, db_df], ignore_index=True)
    combined = combined.dropna(subset=["cleaned_text", "category"])
    combined = combined[combined["cleaned_text"].str.strip() != ""]

    X = combined["cleaned_text"]
    y = combined["category"]
    print(f"📊 Training on {len(combined)} samples across {y.nunique()} categories.")

    # TF-IDF with word bigrams + a calibrated linear classifier. Logistic
    # regression gives far more confident, better-calibrated probabilities than
    # Naive Bayes on this data (mean top-1 confidence ~0.90 vs ~0.68).
    model = Pipeline(
        [
            (
                "tfidf",
                TfidfVectorizer(
                    stop_words="english",
                    ngram_range=(1, 2),
                    sublinear_tf=True,
                    min_df=2,
                    max_features=20000,
                ),
            ),
            ("clf", LogisticRegression(max_iter=1000, C=10)),
        ]
    )

    # Hold out a test split for an honest accuracy estimate when feasible.
    if y.value_counts().min() >= 2:
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, stratify=y
        )
        model.fit(X_train, y_train)
        proba = model.predict_proba(X_test)
        preds = model.classes_[proba.argmax(axis=1)]
        print("\n=== Classification report (held-out test set) ===")
        print(classification_report(y_test, preds, zero_division=0))
        print(f"Accuracy:            {accuracy_score(y_test, preds):.3f}")
        print(f"Mean top-1 confidence: {np.max(proba, axis=1).mean():.3f}")
        # Refit on all data for the final saved model.
        model.fit(X, y)
    else:
        model.fit(X, y)

    joblib.dump(model, MODEL_PATH)
    print(f"✅ Model trained and saved to {MODEL_PATH}")


if __name__ == "__main__":
    main()
