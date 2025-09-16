import env from './env.js';

export default async function crop_disease_prediction(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${env.ML_SERVER}/predict/resnet50`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`ML server error: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      prediction: result.predicted_class,
      inputs: {
        nitrogen: result.inputs?.nitrogen ?? null,
        phosphorous: result.inputs?.phosphorous ?? null,
        pottasium: result.inputs?.pottasium ?? null,
        temperature: result.inputs?.temperature ?? null,
        humidity: result.inputs?.humidity ?? null,
        ph: result.inputs?.ph ?? null,
        rainfall: result.inputs?.rainfall ?? null,
      },
      location: {
        lat: result.location?.lat ?? null,
        lon: result.location?.lon ?? null,
      },
      meta: {
        plantName: result.plant_name,
        diseaseStatus: result.disease_status,
        confidence: result.confidence,
        modelUsed: result.model_used,
        inferenceType: result.inference_type,
      },
      message: `The uploaded image shows **${result.plant_name}** with disease status: **${result.disease_status}**. Confidence is ${(result.confidence * 100).toFixed(1)}%.`,
    };
  } catch (error) {
    console.error('Crop disease prediction error:', error);
    return {
      success: false,
      message: 'Failed to fetch crop disease prediction from ML server.',
      error: error.message,
    };
  }
}
