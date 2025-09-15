import os
import sys
from pathlib import Path
from torchvision import transforms
from PIL import Image
import torch
import torch.nn.functional as F
import numpy as np
import onnxruntime as ort
import io

current_dir = Path(__file__).parent
models_dir = current_dir.parent.parent / "models"
sys.path.insert(0, str(models_dir))

sys.path.insert(0, str(current_dir.parent.parent))
from model import get_model

def detect_num_classes_from_checkpoint(checkpoint_path):
    """Detect number of classes from checkpoint file"""
    try:
        checkpoint = torch.load(checkpoint_path, map_location='cpu')
        if 'model_state_dict' in checkpoint:
            state_dict = checkpoint['model_state_dict']
        else:
            state_dict = checkpoint
        
        for key in state_dict.keys():
            if 'fc.weight' in key or 'classifier.2.weight' in key:
                return state_dict[key].shape[0]
        
        return 38  # default
    except:
        return 38  # default

disease_classes = [
    'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
    'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
    'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight',
    'Corn_(maize)___healthy', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
    'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
    'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
    'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
    'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
    'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
    'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
]


MODEL_CONFIGS = {
    'resnet9': {
        'pytorch_path': './../../models/plant-disease/resnet9_best.pth',
        'onnx_path': './../../models/plant-disease/resnet9_plant_disease.onnx'
    },
    'resnet18': {
        'pytorch_path': './../../models/plant-disease/resnet18_best.pth',
        'onnx_path': './../../models/plant-disease/resnet18_plant_disease.onnx'
    },
    'resnet50': {
        'pytorch_path': './../../models/plant-disease/resnet50_best.pth',
        'onnx_path': './../../models/plant-disease/resnet50_plant_disease.onnx'
    }
}

loaded_models = {}
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def load_pytorch_model(model_name='resnet9'):
    """Load PyTorch model"""
    if model_name in loaded_models:
        return loaded_models[model_name]
    
    config = MODEL_CONFIGS.get(model_name)
    if not config:
        raise ValueError(f"Model {model_name} not supported. Choose from: {list(MODEL_CONFIGS.keys())}")
    
    model_path = config['pytorch_path']
    
    if os.path.exists(model_path):
        try:
            num_classes = detect_num_classes_from_checkpoint(model_path)
            print(f"Detected {num_classes} classes from checkpoint")
            
            model = get_model(model_name, num_classes=num_classes)
            
            checkpoint = torch.load(model_path, map_location=device)
            if 'model_state_dict' in checkpoint:
                model.load_state_dict(checkpoint['model_state_dict'])
            else:
                model.load_state_dict(checkpoint)
            print(f"Loaded {model_name} weights from {model_path}")
            
        except Exception as e:
            print(f"Warning: Could not load weights for {model_name}: {e}")
            print("Using randomly initialized weights with 38 classes")
            model = get_model(model_name, num_classes=len(disease_classes))
    else:
        print(f"Warning: Model file not found at {model_path}")
        print("Using randomly initialized weights")
        model = get_model(model_name, num_classes=len(disease_classes))
    
    model = model.to(device)
    model.eval()
    
    loaded_models[model_name] = model
    return model

def load_onnx_model(model_name='resnet9'):
    """Load ONNX model"""
    onnx_key = f"{model_name}_onnx"
    if onnx_key in loaded_models:
        return loaded_models[onnx_key]
    
    config = MODEL_CONFIGS.get(model_name)
    if not config:
        raise ValueError(f"Model {model_name} not supported. Choose from: {list(MODEL_CONFIGS.keys())}")
    
    onnx_path = config['onnx_path']
    
    if not os.path.exists(onnx_path):
        raise FileNotFoundError(f"ONNX model not found at {onnx_path}")
    
    providers = ['CUDAExecutionProvider', 'CPUExecutionProvider'] if torch.cuda.is_available() else ['CPUExecutionProvider']
    session = ort.InferenceSession(onnx_path, providers=providers)
    
    loaded_models[onnx_key] = session
    print(f"Loaded {model_name} ONNX model from {onnx_path}")
    return session

def predict_image(img, model_name='resnet9', use_onnx=False, confidence_threshold=0.5):
    """
    Predict plant disease from image using specified model
    
    Args:
        img: Input image (PIL Image, file path, or bytes)
        model_name: Model to use ('resnet9', 'resnet18', 'resnet50')
        use_onnx: Whether to use ONNX model (if available)
        confidence_threshold: Minimum confidence for prediction
    
    Returns:
        dict: Prediction results with confidence and details
    """
    transform = transforms.Compose([
        transforms.Resize((256, 256)),
        transforms.ToTensor(),
    ])

    if isinstance(img, str):
        img = Image.open(img).convert("RGB")
    elif isinstance(img, bytes):
        img = Image.open(io.BytesIO(img)).convert("RGB")
    elif not isinstance(img, Image.Image):
        img = img.convert("RGB")

    img_tensor = transform(img).unsqueeze(0)
    
    if use_onnx:
        try:
            session = load_onnx_model(model_name)
            input_name = session.get_inputs()[0].name
            
            logits = session.run(None, {input_name: img_tensor.numpy()})[0]
            
            probabilities = np.exp(logits - np.max(logits, axis=1, keepdims=True))
            probabilities = probabilities / np.sum(probabilities, axis=1, keepdims=True)
            
            confidence = float(np.max(probabilities))
            predicted_idx = int(np.argmax(probabilities))
            
        except Exception as e:
            print(f"ONNX inference failed, falling back to PyTorch: {e}")
            use_onnx = False
    
    if not use_onnx:
        model = load_pytorch_model(model_name)
        img_tensor = img_tensor.to(device)
        
        with torch.no_grad():
            logits = model(img_tensor)
            probabilities = F.softmax(logits, dim=1)
            confidence = float(torch.max(probabilities))
            predicted_idx = int(torch.argmax(probabilities))
    
    if predicted_idx < len(disease_classes):
        predicted_class = disease_classes[predicted_idx]
        parts = predicted_class.split('___')
        plant_name = parts[0].replace('_', ' ').title() if len(parts) >= 1 else "Unknown"
        disease_status = parts[1].replace('_', ' ').title() if len(parts) >= 2 else "Unknown"
    else:
        predicted_class = f"Class_{predicted_idx}"
        plant_name = "Unknown"
        disease_status = f"Predicted_Class_{predicted_idx}"
    
    result = {
        'predicted_class': predicted_class,
        'plant_name': plant_name,
        'disease_status': disease_status,
        'confidence': confidence,
        'is_confident': confidence >= confidence_threshold,
        'model_used': model_name,
        'inference_type': 'ONNX' if use_onnx else 'PyTorch'
    }
    
    return result

def predict_batch(images, model_name='resnet9', use_onnx=False, batch_size=8):
    """
    Predict plant diseases for multiple images
    
    Args:
        images: List of images (paths, PIL Images, or bytes)
        model_name: Model to use
        use_onnx: Whether to use ONNX model
        batch_size: Batch size for processing
    
    Returns:
        list: List of prediction results
    """
    results = []
    
    for i in range(0, len(images), batch_size):
        batch_images = images[i:i + batch_size]
        
        for img in batch_images:
            try:
                result = predict_image(img, model_name, use_onnx)
                results.append(result)
            except Exception as e:
                print(f"Error processing image: {e}")
                results.append({
                    'error': str(e),
                    'predicted_class': 'Error',
                    'confidence': 0.0,
                    'is_confident': False
                })
    
    return results

def get_model_info(model_name='resnet9'):
    """Get information about available models"""
    info = {
        'model_name': model_name,
        'num_classes': len(disease_classes),
        'class_names': disease_classes,
        'pytorch_available': False,
        'onnx_available': False
    }
    
    config = MODEL_CONFIGS.get(model_name, {})
    
    pytorch_path = config.get('pytorch_path', '')
    if os.path.exists(pytorch_path):
        info['pytorch_available'] = True
        info['pytorch_path'] = pytorch_path
    
    onnx_path = config.get('onnx_path', '')
    if os.path.exists(onnx_path):
        info['onnx_available'] = True
        info['onnx_path'] = onnx_path
    
    return info

def convert_pytorch_to_onnx(model_name='resnet9', input_size=(256, 256)):
    """
    Convert PyTorch model to ONNX format
    
    Args:
        model_name: Model to convert
        input_size: Input image size (H, W)
    
    Returns:
        bool: Success status
    """
    try:
        model = load_pytorch_model(model_name)
        
        dummy_input = torch.randn(1, 3, input_size[0], input_size[1]).to(device)
        
        config = MODEL_CONFIGS.get(model_name, {})
        onnx_path = config.get('onnx_path', f'././..//models/plant-disease/resnet9_best.pthplant-disease/{model_name}-plant-disease-model.onnx')
        
        os.makedirs(os.path.dirname(onnx_path), exist_ok=True)
        
        torch.onnx.export(
            model,
            dummy_input,
            onnx_path,
            input_names=["input"],
            output_names=["output"],
            dynamic_axes={
                "input": {0: "batch_size"},
                "output": {0: "batch_size"}
            },
            opset_version=11,
            do_constant_folding=True
        )
        
        print(f"{model_name} model exported to ONNX: {onnx_path}")
        return True
        
    except Exception as e:
        print(f"ONNX export failed for {model_name}: {e}")
        return False

if __name__ == "__main__":
    model_name = 'resnet9'
    use_onnx = True
    convert_to_onnx = False
    test_all_models = False
    
    if len(sys.argv) < 2:
        print("Usage: python onnx_inference.py <image_path>")
        print("Example: python onnx_inference.py tomato.jpg")
        exit(1)
    
    image_path = sys.argv[1]
    
    if not os.path.exists(image_path):
        print(f"Image file not found: {image_path}")
        exit(1)
    
    print(f"Running inference on {image_path}")
    print(f"Model: {model_name}")
    print(f"Using ONNX: {use_onnx}")
    
    try:
        result = predict_image(image_path, model_name, use_onnx)
        
        print(f"\nPrediction Results:")
        print(f"Plant: {result['plant_name']}")
        print(f"Disease Status: {result['disease_status']}")
        print(f"Confidence: {result['confidence']:.3f}")
        print(f"Is Confident: {result['is_confident']}")
        print(f"Model Used: {result['model_used']} ({result['inference_type']})")
        
    except Exception as e:
        print(f"Prediction failed: {e}")
