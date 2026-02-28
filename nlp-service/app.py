# app.py - Improved chatbot with keyword fallback and better session handling

import nltk
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import json
from collections import Counter

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download("punkt")

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download("stopwords")

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

# Get stopwords
stop_words = set(stopwords.words('english'))

# ---------------------------
# Helper functions (define before use)
# ---------------------------
def preprocess_text(text: str) -> str:
    """Improved text preprocessing"""
    if not text:
        return ""
    # Convert to lowercase
    text = text.lower()
    # Remove special characters but keep spaces
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    # Tokenize
    try:
        tokens = word_tokenize(text)
    except:
        tokens = text.split()
    # Remove stopwords and single characters
    tokens = [word for word in tokens if word not in stop_words and len(word) > 1]
    # Join back
    return ' '.join(tokens)

# ---------------------------
# Load trained model & vectorizer
# ---------------------------
try:
    with open("model.pkl", "rb") as f:
        model = pickle.load(f)
except FileNotFoundError:
    print("⚠️ Model not found. Please run train_chatbot.py first.")
    model = None

try:
    with open("vectorizer.pkl", "rb") as f:
        vectorizer = pickle.load(f)
except FileNotFoundError:
    print("⚠️ Vectorizer not found. Please run train_chatbot.py first.")
    vectorizer = None

# ---------------------------
# Load intents JSON
# ---------------------------
with open("intents.json", "r", encoding="utf-8") as f:
    intents_json = json.load(f)

intents_list = intents_json.get("intents", [])
if not intents_list:
    intents_list = intents_json if isinstance(intents_json, list) else []

# Create keyword mapping for fallback
keyword_mapping = {}
for intent in intents_list:
    intent_name = intent["intent"]
    patterns = intent.get("patterns", [])
    # Extract keywords from patterns
    keywords = []
    for pattern in patterns:
        words = preprocess_text(pattern).split()
        keywords.extend(words)
    # Count keyword frequency
    keyword_counter = Counter(keywords)
    # Store top keywords
    keyword_mapping[intent_name] = [word for word, count in keyword_counter.most_common(10)]

# ---------------------------
# Session context for multi-step troubleshooting
# ---------------------------
session_context = {}  # {user_id: {"last_intent": "mouse_issue", "step": 0}}

def keyword_match(user_input: str, intent_keywords: list) -> int:
    """Calculate keyword match score"""
    user_words = set(preprocess_text(user_input).split())
    keyword_set = set(intent_keywords)
    # Count matching keywords
    matches = len(user_words.intersection(keyword_set))
    return matches

def find_best_keyword_match(user_input: str) -> str:
    """Find best intent match using keywords"""
    best_intent = None
    best_score = 0
    
    user_words = set(preprocess_text(user_input).split())
    
    for intent_name, keywords in keyword_mapping.items():
        keyword_set = set(keywords)
        matches = len(user_words.intersection(keyword_set))
        # Normalize by length
        score = matches / max(len(keyword_set), 1)
        if score > best_score:
            best_score = score
            best_intent = intent_name
    
    # Only return if score is above threshold
    if best_score > 0.1:  # At least 10% keyword match
        return best_intent
    return None

def is_continuation(user_input: str) -> bool:
    """Check if user wants to continue (yes, next, continue, etc.)"""
    continuation_words = [
        "yes", "y", "yeah", "yep", "sure", "ok", "okay", "continue", "next", 
        "go ahead", "proceed", "alright", "fine", "correct", "right", "true",
        "yea", "affirmative", "proceed", "next step", "continue", "go on"
    ]
    user_clean = preprocess_text(user_input).lower()
    return any(word in user_clean for word in continuation_words)

def is_resolution(user_input: str) -> bool:
    """Check if user indicates issue is resolved"""
    resolution_words = [
        "resolved", "done", "fixed", "it works", "working now", "fixed it", 
        "solved", "issue resolved", "problem solved", "all good", "it's fine",
        "working", "no problem", "no issues", "everything fine", "all set",
        "sorted", "complete", "finished", "resolved it", "fixed now"
    ]
    user_clean = preprocess_text(user_input).lower()
    return any(word in user_clean for word in resolution_words)

def get_response(user_input: str, user_id: str = "default") -> str:
    """Get chatbot response with improved matching"""
    if not user_input or not user_input.strip():
        return "🤖 Please enter a valid question."
    
    user_input_clean = preprocess_text(user_input)
    
    # ---------------------------
    # Handle ongoing multi-step troubleshooting
    # ---------------------------
    if user_id in session_context:
        last_intent = session_context[user_id]["last_intent"]
        step = session_context[user_id]["step"]
        
        intent_data = next((i for i in intents_list if i["intent"] == last_intent), None)
        if intent_data:
            steps = intent_data.get("responses", [])
            
            # Check if user wants to continue
            if is_continuation(user_input):
                step += 1
            # Check if user indicates resolution
            elif is_resolution(user_input):
                session_context.pop(user_id, None)
                return "🎉 Great! Issue marked as resolved. If you have any other problem, just type your issue."
            # Check if user is asking a new question (not continuation)
            elif step < len(steps) - 1:
                # User might be providing feedback or asking new question
                # Try to detect if it's a new intent
                new_intent = None
                if model and vectorizer:
                    try:
                        X_vec = vectorizer.transform([user_input_clean])
                        new_intent = model.predict(X_vec)[0]
                    except:
                        pass
                
                # If new intent detected and it's different, start new session
                if new_intent and new_intent != last_intent:
                    # New question detected, start new session
                    session_context.pop(user_id, None)
                    # Continue to predict new intent below
                else:
                    # Continue current session
                    session_context[user_id]["step"] = step
                    return steps[step] if step < len(steps) else steps[-1]
            
            # If step reaches or exceeds number of steps, end session
            if step >= len(steps):
                session_context.pop(user_id, None)
                return "✅ Troubleshooting completed. If the issue persists, please report a fault."
            
            # Otherwise, return the current step
            session_context[user_id]["step"] = step
            return steps[step] if step < len(steps) else steps[-1]
    
    # ---------------------------
    # Predict intent using trained model
    # ---------------------------
    intent_pred = None
    confidence = 0
    
    if model and vectorizer:
        try:
            X_vec = vectorizer.transform([user_input_clean])
            intent_pred = model.predict(X_vec)[0]
            # Get prediction probabilities
            proba = model.predict_proba(X_vec)[0]
            confidence = max(proba)
            
            print(f"User Input: {user_input}")
            print(f"Predicted Intent: {intent_pred}")
            print(f"Confidence: {confidence:.2f}")
        except Exception as e:
            print(f"Prediction error: {e}")
            intent_pred = None
    
    # If model prediction confidence is low, try keyword matching
    if not intent_pred or confidence < 0.3:
        keyword_intent = find_best_keyword_match(user_input)
        if keyword_intent:
            print(f"Using keyword match: {keyword_intent}")
            intent_pred = keyword_intent
            confidence = 0.5  # Medium confidence for keyword match
    
    # ---------------------------
    # Respond based on predicted intent
    # ---------------------------
    if intent_pred:
        intent_data = next((i for i in intents_list if i["intent"] == intent_pred), None)
        if intent_data:
            responses = intent_data.get("responses", [])
            # Only start multi-step session if it's a troubleshooting intent with multiple steps
            if len(responses) > 1 and intent_pred not in ["greeting", "goodbye", "thanks", "help"]:
                session_context[user_id] = {"last_intent": intent_pred, "step": 0}
            return responses[0] if responses else "🤖 Sorry, I didn't understand."
    
    # Default fallback with helpful suggestions
    return "🤖 Sorry, I didn't understand that. I can help you with:\n" + \
           "• Reporting equipment faults\n" + \
           "• Troubleshooting issues (monitor, mouse, keyboard, network, etc.)\n" + \
           "• Checking equipment availability\n" + \
           "• Lab information\n\n" + \
           "Try rephrasing your question or type 'help' for more information."

# ---------------------------
# Flask API endpoint
# ---------------------------
@app.route("/chat", methods=["POST"])
def chat_api():
    data = request.get_json()
    if not data:
        return jsonify({"intent": None, "reply": "❗ Invalid request."})
    
    message = data.get("message", "").strip()
    user_id = data.get("userId", "default").strip()
    
    if not message:
        return jsonify({"intent": None, "reply": "❗ Please enter a valid question."})
    
    reply = get_response(message, user_id)
    current_intent = session_context.get(user_id, {}).get("last_intent", None)
    
    return jsonify({
        "intent": current_intent,
        "reply": reply
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})

# ---------------------------
if __name__ == "__main__":
    if model is None or vectorizer is None:
        print("⚠️ WARNING: Model or vectorizer not loaded. Please run train_chatbot.py first.")
    app.run(port=5001, debug=True)
