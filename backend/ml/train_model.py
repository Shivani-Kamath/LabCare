# backend/ml/train_model.py
import sys, pickle
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score

CSV_PATH = sys.argv[1] if len(sys.argv) > 1 else "equipment_faults_dataset.csv"
MODEL_OUT = "model.pkl"
SCALER_OUT = "scaler.pkl"

df = pd.read_csv(CSV_PATH)

# Heuristic label: needsReplacementSoon
df['needsReplacementSoon'] = np.where(
    (df['faultCount'] >= 3) | (df['conditionCode'] >= 2) | (df['lastFaultDays'] < 90),
    1, 0
)

features = ['ageMonths','faultCount','conditionCode','lastFaultDays','resolvedRatio','reportedByLabInchargeRatio']
X = df[features].fillna(0)
y = df['needsReplacementSoon'].astype(int)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)

model = RandomForestClassifier(n_estimators=200, random_state=42, class_weight='balanced')
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
y_proba = model.predict_proba(X_test)[:,1]

print("Classification report:\n", classification_report(y_test, y_pred))
try:
    print("ROC AUC:", roc_auc_score(y_test, y_proba))
except:
    pass

with open(MODEL_OUT, "wb") as f:
    pickle.dump(model, f)
with open(SCALER_OUT, "wb") as f:
    pickle.dump(scaler, f)

print(" Model & scaler saved:", MODEL_OUT, SCALER_OUT)
