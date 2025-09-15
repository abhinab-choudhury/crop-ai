import numpy as np
import joblib
import xgboost.compat as xgb_compat
import os
import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from torchvision import transforms
import onnxruntime as ort

from app.utils.weather_fetch import weather_fetch
from app.utils.onnx_inference import predict_image

app = FastAPI(
    title="Crop AI | ML Server",
    description="An API for Crop Recommendation and Plant Disease Detection.",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

class XGBoostLabelEncoder:
    def __init__(self, *args, **kwargs):
        pass

xgb_compat.XGBoostLabelEncoder = XGBoostLabelEncoder

CROP_MODEL_PATH = os.path.join(BASE_DIR, "models", "crop-recommendation", "XGBoost.pkl")
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

crop_mapping = {
    0: "rice",
    3: "maize",
    5: "chickpea",
    12: "kidneybeans",
    13: "pigeonpeas",
    14: "mothbeans",
    15: "mungbean",
    18: "blackgram",
    24: "lentil",
    60: "pomegranate",
    61: "banana",
    62: "mango",
    63: "grapes",
    66: "watermelon",
    67: "muskmelon",
    69: "apple",
    74: "orange",
    75: "papaya",
    88: "coconut",
    93: "cotton",
    94: "jute",
    95: "coffee"
}


transform = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.ToTensor(),
])


def validate_file(file: UploadFile):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

async def run_prediction(file: UploadFile, model_name: str):
    try:
        image_bytes = await file.read()
        return predict_image(image_bytes, model_name=model_name, use_onnx=True)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException

@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to the Crop AI | API"}

@app.post("/crop-recommend", tags=["Crop Recommendaion"])
def recommend_crop(nitrogen: int, phosphorous: int, pottasium: int, ph: float, rainfall: float, lat: float, lon: float):
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
        # "prediction": str(crop_mapping[int(prediction)]),
        "prediction": str(prediction),
        "inputs": {
            "nitrogen": nitrogen, "phosphorous": phosphorous, "pottasium": pottasium,
            "temperature": temperature, "humidity": humidity, "ph": ph, "rainfall": rainfall,
        },
        "location": {"lat": lat, "lon": lon}
    }

@app.post("/predict/resnet9", tags=["Disease Detection"])
async def predict_resnet9(file: UploadFile = File(...)):
    validate_file(file)
    return await run_prediction(file, "resnet9")

@app.post("/predict/resnet18", tags=["Disease Detection"])
async def predict_resnet18(file: UploadFile = File(...)):
    validate_file(file)
    return await run_prediction(file, "resnet18")

@app.post("/predict/resnet50", tags=["Disease Detection"])
async def predict_resnet50(file: UploadFile = File(...)):
    validate_file(file)
    return await run_prediction(file, "resnet50")