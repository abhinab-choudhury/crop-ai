import { ML_SERVER_API } from '../utils/axios.js';

export default async function cropPrediction({
  nitrogen,
  phosphorus,
  potassium,
  ph,
  rainfall,
  lat,
  lon,
}) {
  console.log('Crop Recommend');

  try {
    const response = await ML_SERVER_API.post(`/crop-recommend`, {
      nitrogen,
      phosphorus,
      potassium,
      ph,
      rainfall,
      lat,
      lon,
    });

    if (!response) {
      throw new Error(`ML server error: ${response.statusText}`);
    }

    const result = response.data;

    return {
      success: true,
      prediction: {
        plant_name: result.prediction,
      },
      inputs: {
        nitrogen: result.inputs.nitrogen,
        phosphorus: result.inputs.phosphorus,
        potassium: result.inputs.potassium,
        temperature: result.inputs.temperature,
        humidity: result.inputs.humidity,
        ph: result.inputs.ph,
        rainfall: result.inputs.rainfall,
      },
      location: {
        lat: result.location.lat,
        lon: result.location.lon,
      },
      message: `Based on your soil and climate data, the recommended crop is **${result.prediction}**`,
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
