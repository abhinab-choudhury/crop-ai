import { Router } from 'express';
import { GoogleGenAI } from '@google/genai';
import { getSoilData } from '../helpers/getSoilData.js';
import { getHistoricalClimateData } from '../helpers/getClimateData.js';
import { getLocation } from '../helpers/getLocation.js';
import { getConversation } from './../helpers/conversationStore.js';

const cropRotationRouter = Router();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function predict(N, P, K, ph, country, state, city, latitude, longitude, language, session) {
  try {
    let coords = { latitude, longitude };
    if (!coords.latitude || !coords.longitude) {
      coords = await getLocation(country, state, city);
    }

    if (!coords.latitude || !coords.longitude) {
      throw new Error('Could not find coordinates for the specified location.');
    }

    const climateData = await getHistoricalClimateData(coords.latitude, coords.longitude);
    const soilApiData = await getSoilData(coords.latitude, coords.longitude);

    const prompt = `
        You are a world-class agronomist and soil scientist AI. Your task is to create an optimal, sustainable, and profitable 12-month crop rotation schedule.

        **Data Profile:**
        - Farm Location: ${city}, ${state}, ${country}
        - Farmer's Soil Measurement: N=${N}, P=${P}, K=${K}, pH=${ph}
        - Soil Profile (ISRIC): pH=${soilApiData.ph || 'N/A'}, Clay=${soilApiData.clayContent || 'N/A'}, SOC=${soilApiData.organicCarbon || 'N/A'}
        - Climate (Last 12 Months): Temp=${climateData.avgTemperature?.toFixed(2) || 'N/A'}°C, Humidity=${climateData.avgHumidity?.toFixed(2) || 'N/A'}%, Precipitation=${climateData.totalPrecipitation?.toFixed(2) || 'N/A'}mm

        **Output Requirements:**
        - Strict JSON, no markdown
        - Language: ${language}
        - Respond concisely and practically
    `;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Include previous conversation for multi-turn context
    const contents = [
      {
        role: 'system',
        parts: [{ text: 'You are an expert in crop rotation and sustainable agriculture.' }],
      },
      ...session.history.map((msg) => ({ role: msg.role, parts: [{ text: msg.content }] })),
      { role: 'user', parts: [{ text: prompt }] },
    ];

    const result = await model.generateContent(contents);
    const text = result.response.text();

    // Save AI response to session
    session.history.push({ role: 'assistant', content: text });

    return text;
  } catch (err) {
    console.error('Error in predict:', err);
    throw err;
  }
}

cropRotationRouter.post('/', async (req, res) => {
  try {
    const {
      sessionId,
      nitrogen,
      phosphorus,
      potassium,
      ph,
      country,
      state,
      city,
      latitude,
      longitude,
      language = 'English',
    } = req.body;

    if (
      !sessionId ||
      !nitrogen ||
      !phosphorus ||
      !potassium ||
      !ph ||
      !country ||
      !state ||
      !city
    ) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields or sessionId.' });
    }

    const session = getConversation(sessionId);
    session.history.push({
      role: 'user',
      content: `Request crop rotation: N=${nitrogen}, P=${phosphorus}, K=${potassium}, pH=${ph}, Location=${city}, ${state}, ${country}`,
    });

    const result = await predict(
      nitrogen,
      phosphorus,
      potassium,
      ph,
      country,
      state,
      city,
      latitude,
      longitude,
      language,
      session,
    );

    return res.json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default cropRotationRouter;
