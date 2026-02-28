# train_chatbot.py - Improved training with TF-IDF

import json
import pickle
import nltk
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Get stopwords
stop_words = set(stopwords.words('english'))

def preprocess_text(text):
    """Improved text preprocessing"""
    # Convert to lowercase
    text = text.lower()
    
    # Remove special characters but keep spaces
    text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
    
    # Tokenize
    tokens = word_tokenize(text)
    
    # Remove stopwords and single characters
    tokens = [word for word in tokens if word not in stop_words and len(word) > 1]
    
    # Join back
    return ' '.join(tokens)

# 1️⃣ Load intents file
with open("intents.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# 2️⃣ Prepare training data with preprocessing
patterns = []
tags = []

for intent in data["intents"]:
    for pattern in intent["patterns"]:
        processed_pattern = preprocess_text(pattern)
        patterns.append(processed_pattern)
        tags.append(intent["intent"])

print(f"📊 Total training patterns: {len(patterns)}")
print(f"📊 Total intents: {len(set(tags))}")

# 3️⃣ Create TF-IDF vectorizer with better parameters
vectorizer = TfidfVectorizer(
    tokenizer=word_tokenize,
    token_pattern=None,
    lowercase=True,
    ngram_range=(1, 2),  # Use unigrams and bigrams
    max_features=5000,  # Limit features for better performance
    min_df=1,
    max_df=0.95
)

# 4️⃣ Vectorize patterns
print("🔄 Vectorizing patterns...")
X = vectorizer.fit_transform(patterns)
y = tags

# 5️⃣ Split for validation (optional, for checking accuracy)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 6️⃣ Train classifier
print("🔄 Training classifier...")
clf = MultinomialNB(alpha=0.1)  # Add smoothing
clf.fit(X_train, y_train)

# 7️⃣ Check accuracy
y_pred = clf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Model accuracy: {accuracy * 100:.2f}%")

# 8️⃣ Retrain on full dataset
clf.fit(X, y)

# 9️⃣ Save model + vectorizer
with open("model.pkl", "wb") as f:
    pickle.dump(clf, f)

with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

print("✅ Chatbot training complete! Model and vectorizer saved.")
print(f"✅ Model trained on {len(patterns)} patterns across {len(set(tags))} intents.")
