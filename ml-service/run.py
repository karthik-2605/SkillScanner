from flask import Flask,request,jsonify
import tempfile
import os
import joblib
import PyPDF2
from text_preprocessing import clean_text
import numpy as np
import re

app = Flask(__name__)

MODEL_PATH = "resume_classifier.pkl"
model = joblib.load(MODEL_PATH)

def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path,"rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text+=page.extract_text() or ""
    return text


def extract_resume_filtered_info(text:str):
    info = {}
    #Extracting name 
    lines = text.split("\n")
    info["name"] = lines[0].strip()

    #Extracting skills
    skills_match = re.search(r"Skills\s*[:\-]?s*(.*)",text,re.IGNORECASE)
    if skills_match:
        info["skills"] = skills_match.group(1).strip()

    

    return info



@app.route("/predict",methods=["POST"])
def predict():
    try:
        if "resume" not in request.files:
            return jsonify({"error":"No resume uploaded"}),400
    
        file = request.files["resume"]

        with tempfile.NamedTemporaryFile(delete=False,suffix = ".pdf") as tmp:
            file.save(tmp.name)
            temp_path = tmp.name

        raw_text = extract_text_from_pdf(temp_path)

        cleaned = clean_text(raw_text)


        prediction = model.predict([cleaned])[0]
        probs = model.predict_proba([cleaned])[0]


        # extracting the top 5 jobs match
        sorted_indices = np.argsort(probs)[::-1]
        top5_indices = sorted_indices[:5]

        top5_probs={
            model.classes_[i]:float(probs[i]) for i in top5_indices
        }
        

        confidence = float(probs[sorted_indices[0]])

        os.remove(temp_path)

        parsed_filtered_info = extract_resume_filtered_info(raw_text)

        top_categories = [model.classes_[i] for i in top5_indices[:3]]


        return jsonify({
            "prediction":prediction,
            "confidence":confidence,
            "top5_probabilities":top5_probs,
            "top_categories":top_categories,
            "resume_text":parsed_filtered_info
        })

    except Exception as e:
        return jsonify({"error":str(e)}),500
    

if __name__=="__main__":
    app.run(host="0.0.0.0",port=5001,debug=True)