# Quick Start Guide - Retrain Chatbot

## 🚀 Quick Steps to Improve Chatbot

### Step 1: Retrain the Model
Open terminal in the `nlp-service` folder and run:
```bash
python train_chatbot.py
```

This will:
- Load the improved training data (300+ patterns)
- Train the model with TF-IDF vectorizer
- Save the updated model files

### Step 2: Restart the Service
```bash
python app.py
```

### Step 3: Test the Chatbot
Try these queries:
- "my mouse is not working"
- "monitor flickering"
- "keyboard problem"
- "how to report a fault"

## ✅ What's Improved

1. **Better Detection**: Model now detects issues from various phrasings
2. **No More "Next Next Next"**: Accepts "yes", "continue", "go ahead", etc.
3. **Keyword Fallback**: Works even if model confidence is low
4. **More Training Data**: 300+ patterns instead of ~50

## 🔄 If You Update intents.json

After adding new patterns to `intents.json`:
```bash
python train_chatbot.py
```

Then restart the service:
```bash
python app.py
```

## 📊 Expected Results

- ✅ Chatbot understands queries better
- ✅ Less need to type "next" multiple times
- ✅ Better keyword detection
- ✅ More natural conversation flow

