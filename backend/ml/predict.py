# backend/ml/predict.py
import sys, json, pickle, numpy as np
from datetime import datetime

MODEL_IN = "model.pkl"
SCALER_IN = "scaler.pkl"

with open(MODEL_IN, "rb") as f:
    model = pickle.load(f)
with open(SCALER_IN, "rb") as f:
    scaler = pickle.load(f)

input_data = json.load(sys.stdin)  # list of dicts

features_order = ['ageMonths','faultCount','conditionCode','lastFaultDays','resolvedRatio','reportedByLabInchargeRatio']

def estimate_time_to_failure(prob):
    if prob >= 0.85: return 0
    if prob >= 0.6: return 1
    if prob >= 0.4: return 2
    return min(12, max(3, int(6 - prob*5)))

results = []
for item in input_data:
    X = np.array([[ item.get(k,0) for k in features_order ]])
    Xs = scaler.transform(X)
    prob = float(model.predict_proba(Xs)[0][1])
    label = int(model.predict(Xs)[0])

    priority_score = int(min(20, round(prob*12 + item.get('ageMonths',0)/6 + item.get('faultCount',0)*1.5)))
    time_to_failure_months = estimate_time_to_failure(prob)
    if prob >= 0.8 or item.get('faultCount',0) >= 4 or item.get('conditionCode',0) >= 2:
        action = "Replace"
    elif prob >= 0.5 or item.get('faultCount',0) >= 2:
        action = "Fix / Repair"
    elif prob >= 0.3:
        action = "Check & Monitor"
    else:
        action = "Monitor"

    results.append({
        "equipmentId": item.get("equipmentId"),
        "component": item.get("name"),
        "labName": item.get("labName"),
        "purchaseDate": item.get("purchaseDate"),
        "ageMonths": item.get("ageMonths"),
        "faultCount": item.get("faultCount"),
        "condition": item.get("condition"),
        "conditionCode": item.get("conditionCode"),
        "probability": round(prob,3),
        "predictedReplace": bool(label),
        "priority_score": priority_score,
        "action": action,
        "confidence": round(prob,3),
        "estimated_time_to_failure_months": time_to_failure_months
    })

sys.stdout.write(json.dumps(results))
