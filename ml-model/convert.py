import os
import joblib
import xgboost as xgb

# Fix for custom class in pickle
class XGBoostLabelEncoder:
    def __init__(self, *args, **kwargs):
        pass

xgb.compat.XGBoostLabelEncoder = XGBoostLabelEncoder

# 🔹 Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PKL_MODEL_PATH = os.path.join(BASE_DIR, "XGBoost.pkl")
JSON_MODEL_PATH = os.path.join(BASE_DIR, "XGBoost.json")

# 🔹 Load Pickle model
if not os.path.exists(PKL_MODEL_PATH):
    raise FileNotFoundError(f"Pickle model not found: {PKL_MODEL_PATH}")

model = joblib.load(PKL_MODEL_PATH)
print("✅ Pickle model loaded successfully.")

# 🔹 Ensure model is XGB model
if not isinstance(model, xgb.Booster):
    if hasattr(model, "get_booster"):
        model = model.get_booster()
    else:
        raise TypeError("Loaded model is not an XGBoost Booster or XGBClassifier.")

# 🔹 Save as JSON
model.save_model(JSON_MODEL_PATH)
print(f"✅ Model successfully converted to JSON: {JSON_MODEL_PATH}")
