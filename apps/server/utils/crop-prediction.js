export default async function crop_prediction({
  nitrogen,
  phosphorous,
  pottasium,
  ph,
  rainfall,
  lat,
  lon,
}) {
  try {
    const response = await fetch(`${process.env.ML_SERVER}/crop-recommend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nitrogen,
        phosphorous,
        pottasium,
        ph,
        rainfall,
        lat,
        lon,
      }),
    });

    if (!response.ok) {
      throw new Error(`ML server error: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      success: true,
      prediction: {
        plant_name: result.prediction,
      },
      inputs: {
        nitrogen: result.inputs.nitrogen,
        phosphorous: result.inputs.phosphorous,
        pottasium: result.inputs.pottasium,
        temperature: result.inputs.temperature,
        humidity: result.inputs.humidity,
        ph: result.inputs.ph,
        rainfall: result.inputs.rainfall,
      },
      location: { lat: result.location.lat, lon: result.location.lon },
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
