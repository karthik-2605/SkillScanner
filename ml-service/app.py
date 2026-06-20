"""Flask ML microservice.

Exposes POST /predict — accepts a resume PDF and returns the predicted job
category, a confidence score, and the top-5 category probabilities using the
TF-IDF + Naive Bayes model produced by train_model.py.
"""

import os
import re
import tempfile

import joblib
import numpy as np
import PyPDF2
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

from text_preprocessing import clean_text

load_dotenv()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "resume_classifier.pkl")

app = Flask(__name__)
CORS(app)

if not os.path.exists(MODEL_PATH):
    raise SystemExit(
        f"Model not found at {MODEL_PATH}.\n"
        "Train it first:  python train_model.py"
    )

model = joblib.load(MODEL_PATH)


def extract_text_from_pdf(pdf_path: str) -> str:
    text = ""
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() or ""
    return text


def extract_resume_info(text: str) -> dict:
    """Best-effort extraction of a candidate name and skills line."""
    info = {}
    lines = [ln.strip() for ln in text.split("\n") if ln.strip()]
    if lines:
        info["name"] = lines[0]

    skills_match = re.search(r"Skills\s*[:\-]?\s*(.+)", text, re.IGNORECASE)
    if skills_match:
        info["skills"] = skills_match.group(1).strip()
    return info


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "categories": len(model.classes_)})


@app.route("/predict", methods=["POST"])
def predict():
    if "resume" not in request.files:
        return jsonify({"error": "No resume uploaded"}), 400

    temp_path = None
    try:
        file = request.files["resume"]
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            file.save(tmp.name)
            temp_path = tmp.name

        raw_text = extract_text_from_pdf(temp_path)
        cleaned = clean_text(raw_text)
        if not cleaned:
            return jsonify({"error": "Could not extract text from the PDF"}), 422

        probs = model.predict_proba([cleaned])[0]
        sorted_indices = np.argsort(probs)[::-1]
        top5 = sorted_indices[:5]

        prediction = str(model.classes_[sorted_indices[0]])
        confidence = float(probs[sorted_indices[0]])
        top5_probabilities = {
            str(model.classes_[i]): float(probs[i]) for i in top5
        }
        top_categories = [str(model.classes_[i]) for i in top5[:3]]

        return jsonify(
            {
                "prediction": prediction,
                "confidence": confidence,
                "top5_probabilities": top5_probabilities,
                "top_categories": top_categories,
                "resume_text": extract_resume_info(raw_text),
            }
        )
    except Exception as exc:  # noqa: BLE001
        return jsonify({"error": str(exc)}), 500
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


if __name__ == "__main__":
    port = int(os.getenv("ML_PORT", "5001"))
    app.run(host="0.0.0.0", port=port, debug=True)
