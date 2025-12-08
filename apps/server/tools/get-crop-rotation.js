export default async function getCropRotation({ N, P, K, pH, state, city }) {
  console.log('Crop Rotation');

  const country = 'India';
  const locationData = await getLocation(country, state, city);

  if (!locationData?.latitude || !locationData?.longitude) {
    return {
      success: false,
      message: 'Could not find coordinates for the specified location.',
    };
  }

  const [climateData, soilApiData] = await Promise.all([
    getHistoricalClimateData(locationData.latitude, locationData.longitude),
    getSoilData(locationData.latitude, locationData.longitude),
  ]);

  const safeClimate = climateData || {};
  const safeSoil = soilApiData || {};

  const message = `
You are a world-class agronomist and soil scientist AI. Your task is to create an optimal, sustainable, and profitable 12-month crop rotation schedule based on the provided data.

DATA PROFILE:
- Farm Location: ${city}, ${state}, ${country}
- Farmer Soil Measurement: N=${N}, P=${P}, K=${K}, pH=${pH}
- ISRIC Soil Profile: pH=${safeSoil.ph ?? 'N/A'}, Clay=${safeSoil.clayContent ?? 'N/A'}, OrganicCarbon=${safeSoil.organicCarbon ?? 'N/A'}
- Climate (12-month avg): Temp=${safeClimate.avgTemperature?.toFixed(2) ?? 'N/A'}°C, Humidity=${safeClimate.avgHumidity?.toFixed(2) ?? 'N/A'}%, Rainfall=${safeClimate.totalPrecipitation?.toFixed(2) ?? 'N/A'}mm

INSTRUCTIONS:
Return ONLY a valid JSON object — no explanations, no markdown, no extra formatting.

The JSON must follow EXACTLY this structure:

{
  "rotationPlan": [
    {
      "season": "string",
      "months": "string",
      "crop": {
        "name": "string",
        "variety": "string"
      },
      "justification": "string",
      "keyActivities": ["string", "string"]
    }
  ],
  "overallSummary": "string"
}

Ensure JSON is clean, escaped, and valid.
  `.trim();

  return {
    message,
    data: {
      climateData: safeClimate,
      soilApiData: safeSoil,
    },
  };
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
