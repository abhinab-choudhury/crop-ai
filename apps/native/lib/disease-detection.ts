import { InferenceSession, Tensor } from 'onnxruntime-react-native';
import { Asset } from 'expo-asset';
import * as ImageManipulator from 'expo-image-manipulator';
import ResNet50Model from '@/assets/resnet50_plant_disease.onnx';

const diseaseClasses = [
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

let session: InferenceSession | null = null;

export default async function loadResNet50() {
  if (session) return session;

  const modelAsset = Asset.fromModule(ResNet50Model);
  await modelAsset.downloadAsync();

  if (!modelAsset.localUri) {
    throw new Error('Failed to resolve local model URI');
  }

  session = await InferenceSession.create(modelAsset.localUri, {
    executionProviders: ['cpuExecutionProvider'],
  });

  return session;
}

async function preprocessImage(uri: string) {
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 256, height: 256 } }],
    { base64: true },
  );

  if (!manipResult.base64) {
    throw new Error('Failed to process image');
  }

  const raw = atob(manipResult.base64);
  const uint8 = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    uint8[i] = raw.charCodeAt(i);
  }

  const float32 = new Float32Array(3 * 256 * 256);
  for (let i = 0; i < 256 * 256; i++) {
    float32[i] = uint8[i * 4] / 255; // R
    float32[i + 256 * 256] = uint8[i * 4 + 1] / 255; // G
    float32[i + 2 * 256 * 256] = uint8[i * 4 + 2] / 255; // B
  }

  return float32;
}

/** Run inference on an image */
export async function runInference(uri: string) {
  if (!session) await loadResNet50();

  const tensorData = await preprocessImage(uri);
  const tensor = new Tensor('float32', tensorData, [1, 3, 256, 256]);

  const feeds: Record<string, Tensor> = {};
  feeds[session!.inputNames[0]] = tensor;

  const results = await session!.run(feeds);
  const output = results[session!.outputNames[0]];

  if (!output) throw new Error('No output from model');

  const data = output.data as Float32Array;
  const maxIdx = data.indexOf(Math.max(...data));
  const confidence = data[maxIdx];

  return {
    predictedClass: diseaseClasses[maxIdx] || `Class_${maxIdx}`,
    confidence: confidence.toFixed(3),
  };
}
