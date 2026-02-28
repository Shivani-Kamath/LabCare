# chatbot.py

import pickle
import json
import re

# Load trained model + vectorizer
with open("model.pkl", "rb") as f:
    clf = pickle.load(f)

with open("vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

# Load intents
with open("intents.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Map intent → responses
responses = {intent["intent"]: intent["responses"] for intent in data["intents"]}

# Session context for multi-step troubleshooting
session_context = {}  # { userId: {"last_intent": intent, "step": step} }

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)
    return text.strip()

def predict_intent(text):
    X_test = vectorizer.transform([text])
    return clf.predict(X_test)[0]

def get_response(user_input, user_id="default"):
    user_input_clean = clean_text(user_input)

    # ✅ Check if user is mid-troubleshooting
    if user_id in session_context:
        last_intent = session_context[user_id]["last_intent"]
        step = session_context[user_id]["step"]
        steps = responses.get(last_intent, None)

        if steps:
            if user_input_clean in ["next", "done"]:
                step += 1
            if step < len(steps):
                session_context[user_id]["step"] = step
                return {"intent": last_intent, "reply": steps[step]}
            else:
                session_context.pop(user_id, None)
                return {"intent": last_intent, "reply": "✅ Troubleshooting completed. If the issue persists, please report a fault."}

    # ✅ Predict new intent
    intent = predict_intent(user_input_clean)
    intent_responses = responses.get(intent, ["🤖 Sorry, I didn’t understand."])

    # If multiple-step, save context
    if len(intent_responses) > 1:
        session_context[user_id] = {"last_intent": intent, "step": 0}

    return {"intent": intent, "reply": intent_responses[0]}
