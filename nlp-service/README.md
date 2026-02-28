# NLP Service - Improved Chatbot

## 🚀 Improvements Made

### 1. **Enhanced Training Data**
- Expanded from ~50 patterns to **300+ patterns** across all intents
- Added variations, synonyms, and common phrasings
- Better coverage of user queries

### 2. **Improved Model**
- Switched from CountVectorizer to **TF-IDF Vectorizer** for better feature extraction
- Added **ngram_range (1,2)** to capture word pairs
- Better text preprocessing with stopword removal
- Model accuracy improved significantly

### 3. **Keyword Fallback System**
- If model confidence is low (<30%), uses keyword matching
- Extracts top keywords from each intent's patterns
- Provides fallback when model fails

### 4. **Better Session Handling**
- Accepts multiple continuation words: "yes", "y", "continue", "next", "go ahead", etc.
- Detects resolution indicators: "resolved", "fixed", "done", "working now", etc.
- More natural conversation flow

### 5. **Improved Text Preprocessing**
- Removes stopwords (the, is, a, etc.)
- Better tokenization
- Handles edge cases

### 6. **Confidence Scoring**
- Model provides confidence scores
- Falls back to keyword matching if confidence is low
- Better error handling

## 📋 Setup & Usage

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Train the Model
```bash
python train_chatbot.py
```

Or use the retrain script:
```bash
python retrain.py
```

### 3. Run the Service
```bash
python app.py
```

The service will run on `http://localhost:5001`

## 🔧 API Endpoints

### POST /chat
Send a chat message to the chatbot.

**Request:**
```json
{
  "message": "my mouse is not working",
  "userId": "user123"
}
```

**Response:**
```json
{
  "intent": "mouse_issue",
  "reply": "🖱️ Mouse issue? Follow these steps:..."
}
```

### GET /health
Check if the service is running and model is loaded.

## 📊 Training Data Structure

The `intents.json` file contains:
- **intent**: Intent name (e.g., "mouse_issue")
- **patterns**: List of example user queries
- **responses**: List of response messages (for multi-step troubleshooting)

## 🎯 Key Features

1. **Multi-step Troubleshooting**: Guides users through troubleshooting steps
2. **Session Management**: Remembers context during troubleshooting
3. **Flexible Input**: Accepts various phrasings and keywords
4. **Fallback System**: Keyword matching when model fails
5. **Better Accuracy**: Improved pattern recognition

## 🔄 Retraining

After updating `intents.json`:
```bash
python train_chatbot.py
```

Or:
```bash
python retrain.py
```

## 📝 Notes

- Model files (`model.pkl`, `vectorizer.pkl`) are generated after training
- Session context is stored in memory (cleared on server restart)
- The service uses port 5001 by default
- CORS is enabled for frontend integration

## 🐛 Troubleshooting

1. **Model not found**: Run `train_chatbot.py` first
2. **Low accuracy**: Add more patterns to `intents.json` and retrain
3. **Import errors**: Ensure all dependencies are installed
4. **NLTK data missing**: The script will auto-download required data

## ✨ Example Queries

- "my monitor is flickering"
- "mouse not working"
- "keyboard issue"
- "how to report a fault"
- "internet not working"
- "printer problem"
- "check equipment list"

