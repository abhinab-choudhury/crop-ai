export default async function crop_prediction({ N, P, K, pH, rainfall, latitude, longitude }) {
  try {
    const response = await fetch(`${process.env.ML_SERVER}/crop-recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        N,
        P,
        K,
        pH,
        rainfall,
        latitude,
        longitude,
      }),
    });

    if (!response.ok) {
      throw new Error(`ML server error: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      prediction: {
        predictedClass: result.predicted_class,
        plantName: result.plant_name,
        diseaseStatus: result.disease_status,
        confidence: result.confidence,
        isConfident: result.is_confident,
        modelUsed: result.model_used,
        inferenceType: result.inference_type,
      },
      message: result.is_confident
        ? `Based on your soil and climate data, the recommended crop is **${result.plant_name}** with ${(
            result.confidence * 100
          ).toFixed(1)}% confidence.`
        : `The model suggests **${result.plant_name}**, but confidence is low (${(
            result.confidence * 100
          ).toFixed(1)}%). Please validate with an expert.`,
    };
  } catch (error) {
    console.error('Crop prediction error:', error);
    return {
      success: false,
      message: 'Failed to fetch crop prediction from ML server.',
      error: error.message,
    };
  }
}
