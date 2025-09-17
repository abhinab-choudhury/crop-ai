from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from typing import Optional

from app.utils.resnet_inference import predict_image
from app.utils.xgboost_inference import predict_crop

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

class CropInput(BaseModel):
    nitrogen: int
    phosphorous: int
    pottasium: int
    ph: float
    rainfall: float
    lat: float
    lon: float

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

@app.post("/crop-recommend", tags=["Crop Recommendation"])
def recommend_crop(data: CropInput):
    try:
        nitrogen = data.nitrogen
        phosphorous = data.phosphorous
        pottasium = data.pottasium
        ph = data.ph
        rainfall = data.rainfall
        lat = data.lat
        lon = data.lon
    except ValueError as e:
        return {
            "success": False,
            "error": f"Invalid input format: {str(e)}",
            "message": "Please provide correct numeric values."
        }
    
    return predict_crop(nitrogen, phosphorous, pottasium, ph, rainfall, lat, lon)

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