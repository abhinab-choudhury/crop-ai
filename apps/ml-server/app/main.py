from fastapi import FastAPI, UploadFile, HTTPException
from pydantic import BaseModel, HttpUrl
from fastapi.middleware.cors import CORSMiddleware
import httpx
from tempfile import SpooledTemporaryFile

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


class CropRecommendationInput(BaseModel):
    nitrogen: int
    phosphorous: int
    pottasium: int
    ph: float
    rainfall: float
    lat: float
    lon: float


class CropDiseaseDetectionInput(BaseModel):
    url: HttpUrl


async def run_prediction(file: UploadFile, model_name: str):
    try:
        image_bytes = await file.read()
        return predict_image(image_bytes, model_name=model_name, use_onnx=True)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")


async def download_file_from_url(url: str) -> UploadFile:
    """Download image from URL and wrap as UploadFile"""
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        response.raise_for_status()

    filename = url.split("/")[-1]
    tmp = SpooledTemporaryFile()
    tmp.write(response.content)
    tmp.seek(0)

    return UploadFile(filename=filename, file=tmp)


async def handle_disease_detection(body: CropDiseaseDetectionInput, model_name: str):
    try:
        print("Body URL: ", body.url)
        file = await download_file_from_url(str(body.url))
        return await run_prediction(file, model_name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch or process image: {e}")



@app.get("/", tags=["Root"])
async def root():
    return {"message": "Welcome to the Crop AI | API"}


@app.post("/crop-recommend", tags=["Crop Recommendation"])
def recommend_crop(data: CropRecommendationInput):
    try:
        return predict_crop(
            data.nitrogen,
            data.phosphorous,
            data.pottasium,
            data.ph,
            data.rainfall,
            data.lat,
            data.lon,
        )
    except ValueError as e:
        return {
            "success": False,
            "error": f"Invalid input format: {str(e)}",
            "message": "Please provide correct numeric values.",
        }


@app.post("/predict/resnet9", tags=["Disease Detection"])
async def predict_resnet9(body: CropDiseaseDetectionInput):
    return await handle_disease_detection(body, "resnet9")


@app.post("/predict/resnet18", tags=["Disease Detection"])
async def predict_resnet18(body: CropDiseaseDetectionInput):
    return await handle_disease_detection(body, "resnet18")


@app.post("/predict/resnet50", tags=["Disease Detection"])
async def predict_resnet50(body: CropDiseaseDetectionInput):
    print("Body: ", body)
    return await handle_disease_detection(body, "resnet50")
