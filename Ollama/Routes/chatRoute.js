
import Ollama from "ollama";
import express from 'express';
import { getLocation } from "../Tools_Functions/cropRotation.js";
import { getHistoricalClimateData } from "../Tools_Functions/cropRotation.js";
import { getSoilData } from "../Tools_Functions/cropRotation.js";

const router = express.Router();

const functions = {
    get_crop_rotation: async ({ N, P, K, pH, state, city }) => {

        const country = 'India';
        const locationData = await getLocation(country, state, city);
        if (!locationData.latitude || !locationData.longitude) {
            return { success: false, message: "Could not find coordinates for the specified location." };
        }

        const [climateData, soilApiData] = await Promise.all([
            getHistoricalClimateData(locationData.latitude, locationData.longitude),
            getSoilData(locationData.latitude, locationData.longitude),
        ]);

        const result = {
            message: `You are a world-class agronomist and soil scientist AI. Your task is to create an optimal, sustainable, and profitable 12-month crop rotation schedule based on the provided data..

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
            data: { climateData, soilApiData }
        };

        return result;
    },
    crop_disease_prediction: async (file) => {
        const result = 'crop disease pridection';
        // choudhoury model call krna and response lena model ka 
        return result;
    }
}

const tools = [
    {
        type: 'function',
        function: {
            name: 'get_crop_rotation',
            "description": "Analyzes farm data, including farmer-provided soil measurements, satellite-based soil and climate data, and location, to generate a detailed, 12-month crop rotation plan. Use this tool when the user asks for a crop rotation schedule, a farming plan, or advice on what to plant based on soil and climate conditions. This function requires precise location details (city and state) and a language preference for the output. Also ask optional soil measurements for Nitrogen (N), Phosphorus (P), Potassium (K), and pH if the user has it would be best if not then also no problem.",
            parameters: {
                type: 'object',
                properties: {
                    N: {
                        type: 'number',
                        description: 'The amount of nitrogen content in the soil',
                    },
                    P: {
                        type: 'number',
                        description: 'The amount of Phosphorus content in the soil',
                    },
                    K: {
                        type: 'number',
                        description: 'The amount of pottasium content in the soil',
                    },
                    pH: {
                        type: 'number',
                        description: 'The amount of pH content of the soil',
                    },
                    state: {
                        type: 'string',
                        description: 'The name of the state of india',
                    },
                    city: {
                        type: 'string',
                        description: 'The name of the city of india',
                    },
                    language: {
                        type: 'string',
                        description: 'The Language name in which user is using to get information. Dont ask this from user you have to find out by your own that what language the user is using'
                    }
                },
                required: ['state', 'city', 'language'],
            },
        },
    },
    {
        type: 'function',
        function: {
            name: 'crop_disease_prediction',
            description: 'Analyzes a crop from a photo to determine if it has a disease. Use this tool when the user provides an image or a URL to an image and asks about a crop\'s health or if it has a disease or the user ask somthing related to crop disease',
            parameters: {
                type: 'object',
                properties: {
                    image: {
                        type: 'file',
                        description: 'The image of the crop about which the user wants to know if it is healthy or having any disease',
                    }
                },
                required: ['image'],
            },
        },
    }
];

const systemMessage = {
    role: "system",
    content: "You are a friendly agricultural AI assistant. Your main tasks are to help users with two specific functions: 1) recommending a crop rotation plan and 2) detecting crop diseases from photos. Do not attempt to use any tools until the user explicitly requests one of these two services and provides all the necessary information. When a user asks about your capabilities, provide a clear, friendly summary of what you can do also give response to the user in the same language in which he is sending the query. This is the instruction for you dont give the exact response to the user"
};

const history = [];
history.push(systemMessage);

router.post('/chat', async (req, res) => {
    const { message } = req.body;

    console.log(history);

    let response = await Ollama.chat({
        model: 'llama3.1',
        messages: [systemMessage, { role: 'user', content: message }],
        tools,
    });

    let toolCalls = response.message.tool_calls;
    let finalResponse = response.message.content;

    if (toolCalls && toolCalls.length > 0) {
        const toolCall = toolCalls[0];
        const toolName = toolCall.function.name;
        const toolArgs = toolCall.function.arguments;

        const toolDef = tools.find(tool => tool.function.name === toolName);
        const requiredInfo = toolDef?.function.parameters.required || [];
        const missingInfo = requiredInfo.filter(param => !toolArgs[param]);


        if (missingInfo.length > 0) {

            console.log("Missing Info" + missingInfo);

            finalResponse = `I can help with that! To get started, I need a few details. Could you please provide the ${missingInfo.join(', ')} for your soil, as well as your city and state?`;

            history.push({ role: 'assistant', content: finalResponse });
            return res.json({ finalResponse, history: history });
        }

        const toolResult = await functions[toolName](toolArgs);

        const newMessages = [
            ...history,
            { role: 'assistant', tool_calls: toolCalls },
            {
                role: 'tool',
                content: JSON.stringify(toolResult),
                name: toolName
            }
        ];

        const finalModelResponse = await Ollama.chat({
            model: 'llama3.1',
            messages: newMessages,
            tools,
        });

        finalResponse = finalModelResponse.message.content;
    }
    history.push({ role: 'assistant', content: finalResponse });
    console.log(finalResponse);
    res.json({ finalResponse, history: history });
})

export default router;