export default async function get_crop_rotation({ N, P, K, pH, state, city }) {
  const country = 'India';
  const locationData = await getLocation(country, state, city);
  if (!locationData.latitude || !locationData.longitude) {
    return { success: false, message: 'Could not find coordinates for the specified location.' };
  }

  const [climateData, soilApiData] = await Promise.all([
    getHistoricalClimateData(locationData.latitude, locationData.longitude),
    getSoilData(locationData.latitude, locationData.longitude),
  ]);

  const result = {
    message: `
      You are a world-class agronomist and soil scientist AI. Your task is to create an optimal, sustainable, and profitable 12-month crop rotation schedule based on the provided data..
      **Data Profile:**
      - **Farm Location:** ${city}, ${state}, ${country}
      - **Farmer's Soil Measurement:** Nitrogen (N): ${N} mg/kg, Phosphorus (P): ${P} mg/kg, Potassium (K): ${K} mg/kg, Soil pH: ${pH}
      - **ISRIC World Soil Profile:** Predicted pH: ${soilApiData.ph || 'N/A'}, Predicted Clay Content: ${soilApiData.clayContent || 'N/A'} g/kg, Predicted Soil Organic Carbon: ${soilApiData.organicCarbon || 'N/A'} dg/kg
      - **Annual Climate Averages (Based on Last 12 Months):** Avg Temperature: ${climateData.avgTemperature?.toFixed(2) || 'N/A'} °C, Avg Humidity: ${climateData.avgHumidity?.toFixed(2) || 'N/A'} %, Total Annual Precipitation: ${climateData.totalPrecipitation?.toFixed(2) || 'N/A'} mm

      **Your Task:**
      Based on ALL the data above, generate a detailed 12-month crop rotation plan.

      **Output Format Instructions:**
      You MUST return the response as a single, valid JSON object. Do not include any text, explanations, or markdown formatting (like \`\`\`json) before or after the JSON object.

      The JSON object must follow this exact structure 

      {
        "rotationPlan": [
          {
            "season": "string (e.g., 'Kharif (Monsoon)')",
            "months": "string (e.g., 'June - October')",
            "crop": {
              "name": "string (Name of the recommended crop)",
              "variety": "string (A suitable variety, if applicable)"
            },
            "justification": "string (A concise explanation for why this crop is recommended for this season, considering soil health, climate, and economics.)",
            "keyActivities": [
              "string (A list of 3-4 key farming activities for this crop during the season)"
            ]
          }
        ],
        "overallSummary": "string (A brief, encouraging summary of the plan's benefits.)"
      }

      **Important:**
      - The "rotationPlan" array should contain 2 to 3 crop suggestions, covering the main seasons for the region.
      - Ensure all string values are properly escaped within the JSON.
      - The entire output must be only the JSON object, starting with { and ending with }.
    `,
    data: { climateData, soilApiData },
  };

  return result;
}

const getLocation = async (country, state, city) => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`,
    );
    const result = await response.json();
    // console.log(result);

    const match = result.results.find(
      (place) =>
        place.country?.toLowerCase() === country.toLowerCase() &&
        place.admin1?.toLowerCase() === state.toLowerCase() &&
        place.name?.toLowerCase() === city.toLowerCase(),
    );

    console.log(match);

    if (!match) {
      console.log('Could not find a precise location match.');
      return {};
    }

    const { latitude, longitude } = match;

    console.log(latitude + ' ' + longitude);

    return { latitude, longitude };
  } catch (error) {
    console.error('Error in getLocation:', error);
    return {};
  }
};

const getHistoricalClimateData = async (latitude, longitude) => {
  try {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() - 1);

    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - 1);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const apiUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${formatDate(startDate)}&end_date=${formatDate(endDate)}&daily=temperature_2m_mean,relative_humidity_2m_mean,precipitation_sum`;

    const response = await fetch(apiUrl);
    const result = await response.json();
    const daily = result.daily;
    // console.log(daily);

    if (!daily || !daily.time || daily.time.length === 0) {
      console.log('Historical weather data not found via Open-Meteo.');
      if (result && result.reason) {
        console.error('API Error Reason:', result.reason);
      }
      return {};
    }

    const days = daily.time.length;

    const totalHumidity = daily.relative_humidity_2m_mean.reduce((sum, val) => sum + (val || 0), 0);
    const avgHumidity = totalHumidity / days;

    const totalPrecipitation = daily.precipitation_sum.reduce((sum, val) => sum + (val || 0), 0);

    const totalTemp = daily.temperature_2m_mean.reduce((sum, val) => sum + (val || 0), 0);
    const avgTemperature = totalTemp / days;

    return { totalPrecipitation, avgTemperature, avgHumidity };
  } catch (error) {
    console.error('Error in getHistoricalClimateData with Open-Meteo:', error);
    return {};
  }
};

const getSoilData = async (latitude, longitude) => {
  try {
    const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lat=${latitude}&lon=${longitude}`;
    const response = await fetch(url);
    const data = await response.json();
    const layers = data?.properties?.layers || [];

    console.log(data?.properties?.layers);

    console.log(JSON.stringify(data, null, 2));

    const getLayerValues = (name) => {
      const layer = layers.find((l) => l.name === name);
      if (!layer) return null;
      return layer.depths[0]?.values?.mean;
    };

    const phValue = getLayerValues('phh2o');
    const nitrogenValue = getLayerValues('nitrogen');
    const clayContent = getLayerValues('clay');
    const organicCarbon = getLayerValues('soc');

    // console.log("ph " + phValue + " nitrogen " + nitrogenValue + " clay " + clayContent + " soc " + organicCarbon);

    return {
      ph: phValue ? (phValue / 10).toFixed(2) : null,
      nitrogen: nitrogenValue,
      clayContent: clayContent,
      organicCarbon: organicCarbon,
    };
  } catch (error) {
    console.error('Error in getSoilData:', error);
    return {};
  }
};
