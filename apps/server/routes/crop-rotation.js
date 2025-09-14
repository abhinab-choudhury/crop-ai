import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { getSoilData } from '../helpers/getSoilData.js';
import { getHistoricalClimateData } from '../helpers/getClimateData.js';
import { getLocation } from '../helpers/getLocation.js';
import { getConversation } from './../helpers/conversationStore.js';

const cropRotationRouter = Router();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const predict = async (N, P, K, ph, country, state, city, language) => {
  const locationData = await getLocation(country, state, city);
  if (!locationData.latitude || !locationData.longitude) {
    return { success: false, message: "Could not find coordinates for the specified location." };
  }
  const climateData = await getHistoricalClimateData(locationData.latitude, locationData.longitude);
  const soilApiData = await getSoilData(locationData.latitude, locationData.longitude);
  console.log("humidity " + climateData.avgHumidity + " temperature " + climateData.avgTemperature + " precipitation " + climateData.totalPrecipitation);
  console.log(soilApiData);
  console.log("ph " + soilApiData.ph + " nitrogen " + soilApiData.nitrogen + " clay " + soilApiData.clayContent + " soc " + soilApiData.organicCarbon);
  try {
    const prompt = `
You are a world-class agronomist and soil scientist AI. Your task is to create an optimal, sustainable, and profitable 12-month crop rotation schedule based on the provided data.
*Data Profile:*
- *Farm Location:* ${city}, ${state}, ${country}
- *Farmer's Soil Measurement:* Nitrogen (N): ${N} mg/kg, Phosphorus (P): ${P} mg/kg, Potassium (K): ${K} mg/kg, Soil pH: ${ph}
- *ISRIC World Soil Profile:* Predicted pH: ${soilApiData.ph || 'N/A'}, Predicted Clay Content: ${soilApiData.clayContent || 'N/A'} g/kg, Predicted Soil Organic Carbon: ${soilApiData.organicCarbon || 'N/A'} dg/kg
- *Annual Climate Averages (Based on Last 12 Months):* Avg Temperature: ${climateData.avgTemperature?.toFixed(2) || 'N/A'} °C, Avg Humidity: ${climateData.avgHumidity?.toFixed(2) || 'N/A'} %, Total Annual Precipitation: ${climateData.totalPrecipitation?.toFixed(2) || 'N/A'} mm
*Your Task:*
Based on ALL the data above, generate a detailed 12-month crop rotation plan.
*Output Format Instructions:*
You MUST return the response as a single, valid JSON object. Do not include any text, explanations, or markdown formatting (like \\\`json) before or after the JSON object.
The JSON object must follow this exact structure with the language ${language} not always in English:
{
  "rotationPlan": [
    {
      "season": "string (e.g., 'Kharif (Monsoon)')",
      "months": "string (e.g., 'June - October')",
      "crop": {
        "name": "string (Name of the recommended crop)",
        "variety": "string (A suitable variety, if applicable)"
      },
      "justification": "string (Concise explanation why this crop fits)",
      "keyActivities": [
        "string (3-4 key farming activities)"
      ]
    }
  ],
  "overallSummary": "string (Brief, encouraging summary of the plan)"
}
*Rules:*
- JSON keys stay in English
- All string values must be in ${language}
- Include 2-3 seasons with 4 activities each
- Ensure valid JSON output
`;
    // Calling Ollama with llama3.2:3b
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2:3b",
        prompt: prompt,
        stream: false
      })
    });
    const data = await response.json();
    console.log(data.response);
    return data.response;
  } catch (error) {
    console.error("Error generating content from Ollama llama3.2:3b:", error);
    return error;
  }
};

cropRotationRouter.post('/', async (req, res) => {
  try {
    const { sessionId, inputString, language = 'English' } = req.body;

    if (!sessionId || !inputString) {
      return res.status(400).json({
        success: false,
        message: 'Missing sessionId or inputString.',
      });
    }

    // Parse input string
    const inputObj = {};
    inputString.split(',').forEach((pair) => {
      const [key, value] = pair.split('=').map((v) => v.trim());
      if (key && value) inputObj[key.toLowerCase()] = value;
    });

    const { n, p, k, ph, country, state, city } = inputObj;

    // Validate all required inputs
    if (!n || !p || !k || !ph || !country || !state || !city) {
      return res.status(400).json({
        success: false,
        message: 'Missing required inputs in the string. Required: N, P, K, pH, Country, State, City.',
      });
    }

    const session = getConversation(sessionId);
    session.history.push({
      role: 'user',
      content: `Request crop rotation with inputs: ${inputString}`,
    });

    const result = await predict(
      Number(n),
      Number(p),
      Number(k),
      Number(ph),
      country,
      state,
      city,
      language
    );

    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error in crop rotation API:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});


export default cropRotationRouter;
