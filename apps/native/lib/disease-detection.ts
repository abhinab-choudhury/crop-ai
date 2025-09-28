import { Asset } from 'expo-asset';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ort from 'onnxruntime-react-native';
import { Buffer } from 'buffer';

const { Tensor } = ort;

// List of disease classes
export const diseaseClasses = [
  'Apple___Apple_scab',
  'Apple___Black_rot',
  'Apple___Cedar_apple_rust',
  'Apple___healthy',
  'Blueberry___healthy',
  'Cherry___Powdery_mildew',
  'Cherry___healthy',
  'Corn___Cercospora_leaf_spot',
  'Corn___Common_rust',
  'Corn___Northern_Leaf_Blight',
  'Corn___healthy',
  'Grape___Black_rot',
  'Grape___Esca',
  'Grape___Leaf_blight',
  'Grape___healthy',
  'Orange___Haunglongbing',
  'Peach___Bacterial_spot',
  'Peach___healthy',
  'Pepper___Bacterial_spot',
  'Pepper___healthy',
  'Potato___Early_blight',
  'Potato___Late_blight',
  'Potato___healthy',
  'Raspberry___healthy',
  'Soybean___healthy',
  'Squash___Powdery_mildew',
  'Strawberry___Leaf_scorch',
  'Strawberry___healthy',
  'Tomato___Bacterial_spot',
  'Tomato___Early_blight',
  'Tomato___Late_blight',
  'Tomato___Leaf_Mold',
  'Tomato___Septoria_leaf_spot',
  'Tomato___Spider_mites',
  'Tomato___Target_Spot',
  'Tomato___Yellow_Leaf_Curl_Virus',
  'Tomato___Mosaic_virus',
  'Tomato___healthy',
];

let session: ort.InferenceSession | null = null;

// Load ResNet50 model
export async function loadResNet50() {
  if (session) return session;

  const modelAsset = Asset.fromModule(require('@/assets/resnet50_plant_disease.onnx'));
  console.log("modelAsset: ", modelAsset);
  await modelAsset.downloadAsync();

  if (!modelAsset.localUri) throw new Error('Failed to resolve local model URI');

  session = await ort.InferenceSession.create(modelAsset.localUri, {
    executionProviders: ['cpuExecutionProvider'],
  });

  return session;
}

// Preprocess image into Float32Array for ONNX model
async function preprocessImage(uri: string) {
  // Resize to 224x224
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 224, height: 224 } }],
    { base64: true }
  );

  if (!manipResult.base64) throw new Error('Failed to process image');

  // Decode base64
  const raw = Buffer.from(manipResult.base64, 'base64');

  // Convert to Float32Array (CHW)
  const float32 = new Float32Array(3 * 224 * 224);
  let offset = 0;
  for (let i = 0; i < 224 * 224; i++) {
    float32[i] = raw[offset++] / 255; // R
    float32[i + 224 * 224] = raw[offset++] / 255; // G
    float32[i + 2 * 224 * 224] = raw[offset++] / 255; // B
    offset++; 
  }

  return float32;
}

// Run inference on a given image URI
export async function runInference(uri: string) {
  if (!session) await loadResNet50();

  const tensorData = await preprocessImage(uri);
  const tensor = new Tensor('float32', tensorData, [1, 3, 224, 224]);

  const feeds: Record<string, typeof tensor> = {};
  feeds[session!.inputNames[0]] = tensor;

  const results = await session!.run(feeds);
  const output = results[session!.outputNames[0]];

  if (!output) throw new Error('No output from model');

  const data = output.data as Float32Array;
  const maxIdx = data.indexOf(Math.max(...data));
  const confidence = data[maxIdx];

  return {
    predictedClass: diseaseClasses[maxIdx] || `Class_${maxIdx}`,
    confidence: (confidence * 100).toFixed(2) + '%',
  };
}
