import os
import joblib
import xgboost.compat as xgb_compat
import numpy as np
from app.utils.weather_fetch import weather_fetch

crop_mapping = {
    0: "apple",
    1: "banana", 
    2: "blackgram",
    3: "chickpea",
    4: "coconut",
    5: "coffee",
    6: "cotton",
    7: "grapes",
    8: "jute",
    9: "kidneybeans",
    10: "lentil",
    11: "maize",
    12: "mango",
    13: "mothbeans",
    14: "mungbean",
    15: "muskmelon",
    16: "orange",
    17: "papaya",
    18: "pigeonpeas",
    19: "pomegranate",
    20: "rice",
    21: "watermelon"
}
class XGBoostLabelEncoder:
    def __init__(self, *args, **kwargs):
        pass

xgb_compat.XGBoostLabelEncoder = XGBoostLabelEncoder

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

CROP_MODEL_PATH = os.path.join(BASE_DIR, "..", "models", "crop-recommendation", "XGBoost.pkl")
print(CROP_MODEL_PATH)
crop_recommendation_model = None
if os.path.exists(CROP_MODEL_PATH):
    try:
        crop_recommendation_model = joblib.load(CROP_MODEL_PATH)
        print("✅ XGBoost Crop Recommendation model loaded successfully.")
    except Exception as e:
        print(f"❌ Error loading XGBoost model: {e}")
else:
    print(f"⚠️ Warning: XGBoost model file not found at {CROP_MODEL_PATH}")


def predict_crop(nitrogen: int, phosphorous: int, pottasium: int, ph: float, rainfall: float, lat: float, lon: float):
    if crop_recommendation_model is None:
        raise RuntimeError("Crop recommendation model is not available.")

     # Get weather data
    try:
        weather = weather_fetch(lat, lon)
        if weather is None:
            raise ConnectionError("Weather data unavailable for the given coordinates.")
        temperature, humidity = weather
    except Exception as e:
        raise ConnectionError(f"Weather service error: {e}") from e

    # Make prediction
    try:
        data = np.array([[nitrogen, phosphorous, pottasium, temperature, humidity, ph, rainfall]])
        prediction = crop_recommendation_model.predict(data)[0]
    except Exception as e:
        raise ValueError(f"Failed to make a crop prediction: {e}") from e

    return {
        "prediction": str(crop_mapping[int(prediction)]),
        "inputs": {
            "nitrogen": nitrogen, "phosphorous": phosphorous, "pottasium": pottasium,
            "temperature": temperature, "humidity": humidity, "ph": ph, "rainfall": rainfall,
        },
        "location": {"lat": lat, "lon": lon}
    }

# print(predict_crop(284, 45.4, 189, 134, 214, 6.7, 200, 24.24, 86.76))    