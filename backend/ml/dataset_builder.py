from pymongo import MongoClient
import pandas as pd
from datetime import datetime

client = MongoClient("mongodb://127.0.0.1:27017/")
db = client['labcareDB']

equipments = list(db.equipment.find())
faults = list(db.faults.find())

data = []
now = datetime.now()

for eq in equipments:
    eq_id = eq["_id"]
    eq_faults = [f for f in faults if f["equipmentId"] == eq_id]
    num_past_faults = len(eq_faults)

    # Last fault date
    last_fault_date = max([f["createdAt"] for f in eq_faults], default=None)
    if last_fault_date:
        last_fault_date = pd.to_datetime(last_fault_date)
        days_since_last_fault = (now - last_fault_date).days
        last_status = eq_faults[-1]["status"]
    else:
        days_since_last_fault, last_status = None, "None"

    # Equipment age
    try:
        purchase_date = pd.to_datetime(eq["purchaseDate"], errors="coerce", dayfirst=True)
        equipment_age_days = (now - purchase_date).days if purchase_date else None
    except Exception:
        equipment_age_days = None

    # ----- Rule-Based Labels -----
    if equipment_age_days and (equipment_age_days > 1000 or num_past_faults > 3):
        action = "Replace"
    elif num_past_faults >= 1:
        action = "Fix"
    else:
        action = "Check"

    if last_status == "in_progress":
        time_to_action = "Immediate"
    elif equipment_age_days and equipment_age_days > 700:
        time_to_action = "1 Month"
    else:
        time_to_action = "3 Months"

    faulty_next_month = 1 if any(
        pd.to_datetime(f["createdAt"]) > now - pd.Timedelta(days=30) for f in eq_faults
    ) else 0

    data.append({
        "equipment_type": eq.get("name"),
        "lab_name": eq.get("labName"),
        "equipment_age_days": equipment_age_days,
        "num_past_faults": num_past_faults,
        "days_since_last_fault": days_since_last_fault,
        "last_status": last_status,
        "condition": eq.get("condition"),
        "faulty_next_month": faulty_next_month,
        "action": action,
        "time_to_action": time_to_action
    })

df = pd.DataFrame(data)
df.to_csv("labcare_dataset.csv", index=False)
print("✅ Dataset exported: labcare_dataset.csv")
