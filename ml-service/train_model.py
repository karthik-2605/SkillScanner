import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib
from text_preprocessing import clean_text
import mysql.connector
import os


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR,"UpdatedResumeDataSet.csv")
df = pd.read_csv(csv_path)
df["cleaned_resume"] = df["Resume"].apply(clean_text)
csv_df = df.rename(columns={"cleaned_resume": "cleaned_text", "Category": "category"})


db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="9820256@MajorK",
    database="skillScanner"
)
cursor = db.cursor(dictionary=True)
cursor.execute("SELECT job_title, job_info, category FROM jobs")
rows = cursor.fetchall()


df_backend = pd.DataFrame(rows)
df_backend["text"] = df_backend["job_title"].astype(str) + " " + df_backend["job_info"].astype(str)
df_backend["cleaned_text"] = df_backend["text"].apply(clean_text)


df_backend = df_backend.rename(columns={"category": "category"})


combined_df = pd.concat([csv_df[["cleaned_text", "category"]],
                         df_backend[["cleaned_text", "category"]]])

print(combined_df)


X = combined_df["cleaned_text"]
y = combined_df["category"]

model = Pipeline([
    ('tfidf', TfidfVectorizer()),
    ('clf', MultinomialNB())
])

model.fit(X, y)


y_pred = model.predict(X)
print(classification_report(y, y_pred))


joblib.dump(model, "resume_classifier.pkl")
print("✅ Model trained on CSV + SQL jobs and saved as resume_classifier.pkl")

print(combined_df.head())
