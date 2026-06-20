"""Lightweight text preprocessing for resume classification.

Keeps dependencies minimal (pure regex, no spaCy / nltk downloads) so the
project trains and runs reproducibly right after `pip install`. Stop-word
removal is handled by the TF-IDF vectorizer (`stop_words="english"`).
"""

import re

# Strip HTML tags, URLs, then anything that isn't a letter/number/space.
_HTML_TAG = re.compile(r"<[^>]+>")
_URL = re.compile(r"http\S+|www\.\S+")
_NON_ALNUM = re.compile(r"[^a-z0-9\s]")
_MULTISPACE = re.compile(r"\s+")


def clean_text(text: str) -> str:
    """Normalise raw resume text into a clean, lower-cased token string."""
    if not isinstance(text, str):
        text = str(text or "")

    text = text.lower()
    text = _HTML_TAG.sub(" ", text)
    text = _URL.sub(" ", text)
    # Remove non-ASCII encoding artdefacts (e.g. "â", "¢").
    text = text.encode("ascii", "ignore").decode("ascii")
    text = _NON_ALNUM.sub(" ", text)
    text = _MULTISPACE.sub(" ", text).strip()
    return text
