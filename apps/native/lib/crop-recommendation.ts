import xgboost from 'xgboost';
import { Asset } from 'expo-asset';

// Crop label mapping
const cropMapping: Record<number, string> = {
  0: 'apple',
  1: 'banana',
  2: 'blackgram',
  3: 'chickpea',
  4: 'coconut',
  5: 'coffee',
  6: 'cotton',
  7: 'grapes',
  8: 'jute',
  9: 'kidneybeans',
  10: 'lentil',
  11: 'maize',
  12: 'mango',
  13: 'mothbeans',
  14: 'mungbean',
  15: 'muskmelon',
  16: 'orange',
  17: 'papaya',
  18: 'pigeonpeas',
  19: 'pomegranate',
  20: 'rice',
  21: 'watermelon',
};

export interface CropInputs {
  nitrogen: number;
  phosphorous: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface Location {
  lat: number;
  lon: number;
}

export interface CropRecommendation {
  prediction: string;
  inputs: CropInputs;
  location: Location;
}

let model: any;

try {
  const modelAsset = Asset.fromModule(require('@/assets/crop-xgboost.onnx'));
  await modelAsset.downloadAsync();
  model = xgboost.XGModel(modelAsset.localUri!);
  console.log('✅ XGBoost model loaded successfully.');
} catch (err) {
  console.error('❌ Failed to load XGBoost model:', err);
  process.exit(1);
}

// --- Inference Function ---
export function recommendCrop(
  humidity: number,
  temperature: number,
  nitrogen: number,
  phosphorous: number,
  potassium: number,
  ph: number,
  rainfall: number,
  lat: number,
  lon: number,
): CropRecommendation {
  if (!model) {
    throw new Error('Model not loaded.');
  }

  const input = new Float32Array([
    nitrogen,
    phosphorous,
    potassium,
    temperature,
    humidity,
    ph,
    rainfall,
  ]);

  const mat = xgboost.matrix(input, 2, 3);
  const result = model.predict(mat);

  const predictionIndex =
    result && result.value instanceof Float32Array ? result.value[0] : (result.value as number);

  return {
    prediction: cropMapping[Math.round(predictionIndex)] ?? 'unknown',
    inputs: {
      nitrogen,
      phosphorous,
      potassium,
      temperature,
      humidity,
      ph,
      rainfall,
    },
    location: { lat, lon },
  };
}

// console.log(
//   recommendCrop(284, 45.4, 189, 134, 214, 6.7, 200, 24.24, 86.76)
// );
