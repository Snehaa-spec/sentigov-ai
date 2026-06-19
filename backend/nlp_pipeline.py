from textblob import TextBlob
import re

def clean_text(text):
    # Basic cleaning
    text = re.sub(r'http\S+', '', text) # remove URLs
    text = re.sub(r'@[A-Za-z0-9]+', '', text) # remove mentions
    text = re.sub(r'[^a-zA-Z0-9\s.,!?]', '', text) # remove special characters but keep punctuation
    return text.strip()

def analyze_sentiment(text):
    """
    Analyzes sentiment using TextBlob.
    """
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity
    
    if polarity > 0.1:
        sentiment = "Positive"
    elif polarity < -0.1:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
        
    # Mock confidence score (0 to 1) based on absolute polarity
    # The stronger the polarity, the more confident we are
    confidence = min(abs(polarity) + 0.5, 0.99)
    if sentiment == "Neutral":
        confidence = 0.85 # High confidence for neutral if polarity is near 0
        
    return {
        "sentiment": sentiment,
        "polarity": round(polarity, 4),
        "subjectivity": round(subjectivity, 4),
        "confidence": round(confidence, 4),
        "cleaned_text": clean_text(text)
    }
