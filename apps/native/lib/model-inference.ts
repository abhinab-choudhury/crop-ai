// import * as ort from 'onnxruntime-react-native';
// import { Asset } from 'expo-asset';

// const DISEASE_CLASSES: string[] = [
//     'Apple___Apple_scab', 'Apple___Black_rot', 'Apple___Cedar_apple_rust', 'Apple___healthy',
//     'Blueberry___healthy', 'Cherry_(including_sour)___Powdery_mildew', 'Cherry_(including_sour)___healthy',
//     'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot', 'Corn_(maize)___Common_rust_', 'Corn_(maize)___Northern_Leaf_Blight',
//     'Corn_(maize)___healthy', 'Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
//     'Grape___healthy', 'Orange___Haunglongbing_(Citrus_greening)', 'Peach___Bacterial_spot', 'Peach___healthy',
//     'Pepper,_bell___Bacterial_spot', 'Pepper,_bell___healthy', 'Potato___Early_blight', 'Potato___Late_blight', 'Potato___healthy',
//     'Raspberry___healthy', 'Soybean___healthy', 'Squash___Powdery_mildew', 'Strawberry___Leaf_scorch', 'Strawberry___healthy',
//     'Tomato___Bacterial_spot', 'Tomato___Early_blight', 'Tomato___Late_blight', 'Tomato___Leaf_Mold',
//     'Tomato___Septoria_leaf_spot', 'Tomato___Spider_mites Two-spotted_spider_mite', 'Tomato___Target_Spot',
//     'Tomato___Tomato_Yellow_Leaf_Curl_Virus', 'Tomato___Tomato_mosaic_virus', 'Tomato___healthy'
// ];

// const MODEL_INPUT_SIZE = 256;
// const CONFIDENCE_THRESHOLD = 0.5;

// interface PredictionResult {
//     predictedClass: string;
//     plantName: string;
//     diseaseStatus: string;
//     confidence: number;
//     isConfident: boolean;
//     classIndex: number;
// }

// let inferenceSession: ort.InferenceSession | null = null;

// export async function loadModel(modelAsset: any): Promise<void> {
//     const assets = await Asset.loadAsync(modelAsset);
//     const modelUri = assets[0].localUri;
//     if (!modelUri) {
//         throw new Error('Failed to get model URI');
//     }
//     inferenceSession = await ort.InferenceSession.create(modelUri);
// }

// function softmax(logits: Float32Array | number[]): number[] {
//     const maxLogit = Math.max(...Array.from(logits));
//     const expScores = Array.from(logits).map(x => Math.exp(x - maxLogit));
//     const sumExpScores = expScores.reduce((a, b) => a + b, 0);
//     return expScores.map(x => x / sumExpScores);
// }

// function parseClassName(className: string): { plantName: string; diseaseStatus: string } {
//     const parts = className.split('___');
//     const plantName = parts[0]?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Unknown';
//     const diseaseStatus = parts[1]?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Unknown';
//     return { plantName, diseaseStatus };
// }

// export async function predictImage(inputData: Float32Array): Promise<PredictionResult> {
//     if (!inferenceSession) {
//         throw new Error('Model not loaded. Call loadModel() first.');
//     }

//     const inputTensor = new ort.Tensor('float32', inputData, [1, 3, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE]);

//     const feeds: Record<string, ort.Tensor> = {};
//     feeds[inferenceSession.inputNames[0]] = inputTensor;

//     const results = await inferenceSession.run(feeds);
//     const output = results[inferenceSession.outputNames[0]];

//     if (!output || !output.data) {
//         throw new Error('No output from model');
//     }

//     const logits = output.data as Float32Array;
//     const probabilities = softmax(logits);

//     const maxProbability = Math.max(...probabilities);
//     const predictedIndex = probabilities.indexOf(maxProbability);

//     const predictedClass = predictedIndex < DISEASE_CLASSES.length
//         ? DISEASE_CLASSES[predictedIndex]
//         : `Class_${predictedIndex}`;

//     const { plantName, diseaseStatus } = parseClassName(predictedClass);

//     return {
//         predictedClass,
//         plantName,
//         diseaseStatus,
//         confidence: maxProbability,
//         isConfident: maxProbability >= CONFIDENCE_THRESHOLD,
//         classIndex: predictedIndex
//     };
// }

// export function getDiseaseClasses(): string[] {
//     return [...DISEASE_CLASSES];
// }

// export function isModelLoaded(): boolean {
//     return inferenceSession !== null;
// }

// export function getModelInputSize(): number {
//     return MODEL_INPUT_SIZE;
// }
