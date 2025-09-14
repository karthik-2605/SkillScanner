from bs4 import BeautifulSoup  # used to remove the HTML components
import re                      # used to remove URLs and punctuation
import string                  # used to access list of punctuation
import spacy                   # best library for lemmatization
import nltk
nltk.download('punkt')

nlp = spacy.load("en_core_web_sm")

def clean_text(text: str) -> str:
    text = text.lower()
    text = BeautifulSoup(text, "html.parser").get_text()
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)
    text = re.sub(rf"[{string.punctuation}]", "", text)
    ext = re.sub(r"\s+", " ", text)  # remove extra whitespace
    
    # Remove encoding artifacts like â, ¢, etc.
    text = re.sub(r"[^\x00-\x7F]+", " ", text)


    # spaCy handles tokenization + stop word removal + lemmatization
    doc = nlp(text)
    tokens = [
        token.lemma_ for token in doc
        if not token.is_stop and not token.is_punct and token.lemma_ != '\n'
    ]
    
    return ' '.join(tokens)
        # return cleaned, lemmatized string

