import Ollama from 'ollama';
import express from 'express';
import crop_disease_prediction from '../utils/crop-disease-prediction.js';
import crop_prediction from '../utils/crop-prediction.js';
import get_crop_rotation from '../utils/get-crop-rotation.js';

const chatRouter = express.Router();

const functions = {
  get_crop_rotation: async (args) => await get_crop_rotation(args),
  crop_disease_prediction: async (args) => await crop_disease_prediction(args.image),
  crop_prediction: async (args) => await crop_prediction(args),
};

const tools = [
  {
    type: 'function',
    function: {
      name: 'get_crop_rotation',
      description:
        'Generates a 12-month crop rotation plan (long-term strategy). Use this when user asks about crop planning over seasons or a farming schedule.',
      parameters: {
        type: 'object',
        properties: {
          N: { type: 'number', description: 'Soil Nitrogen content' },
          P: { type: 'number', description: 'Soil Phosphorus content' },
          K: { type: 'number', description: 'Soil Potassium content' },
          pH: { type: 'number', description: 'Soil pH level' },
          state: { type: 'string', description: 'State in India' },
          city: { type: 'string', description: 'City in India' },
          language: { type: 'string', description: 'Language of the user’s query' },
        },
        required: ['state', 'city', 'language'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'crop_disease_prediction',
      description:
        'Analyzes a crop photo for diseases. Use when the user uploads or links an image asking about crop health.',
      parameters: {
        type: 'object',
        properties: {
          image: { type: 'file', description: 'Crop image' },
        },
        required: ['image'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'crop_prediction',
      description:
        "Predicts the best crop to grow right now based on soil nutrients, climate, and location. Use this when user asks: 'What should I grow now?' or provides soil + weather details.",
      parameters: {
        type: 'object',
        properties: {
          nitrogen: { type: 'number', description: 'Nitrogen content in soil' },
          phosphorous: { type: 'number', description: 'Phosphorus content in soil' },
          pottasium: { type: 'number', description: 'Potassium content in soil' },
          ph: { type: 'number', description: 'Soil pH value' },
          rainfall: { type: 'number', description: 'Expected rainfall (mm)' },
          lat: { type: 'number', description: 'Latitude of farm' },
          lon: { type: 'number', description: 'Longitude of farm' },
        },
        required: ['nitrogen', 'phosphorous', 'pottasium', 'ph', 'rainfall', 'lat', 'lon'],
      },
    },
  },
];

const systemMessage = {
  role: 'system',
  content: `
    You are a friendly and knowledgeable agricultural AI assistant.

    You have 3 main tool functions:

    1. **Crop Rotation (get_crop_rotation)**  
      • Generates a 12-month crop rotation plan.  
      • Trigger: Use only when the user explicitly asks about crop planning, multi-season schedules, or long-term farming strategies.  

    2. **Crop Recommendation (crop_prediction)**  
      • Predicts the best crop to grow right now using soil nutrients, weather, and location data.  
      • Trigger: Use only when the user directly asks “what should I grow now?” or provides soil/weather/location info specifically for deciding what to plant.  

    3. **Crop Disease Detection (crop_disease_prediction)**  
      • Detects crop diseases from an uploaded or linked image.  
      • Trigger: Use only when the user provides an image or explicitly asks about visible symptoms or crop health concerns.  

    ---

    ### Tool Usage Rules
    - Call a tool **only if the user’s intent clearly matches one of the triggers above**.  
    - Do **not** call a tool automatically unless the user explicitly requests it, or their input clearly provides all necessary parameters.  
    - If the query is **partially related** (e.g., “my soil is bad” without details), first **ask clarifying questions** to collect missing information instead of calling the tool.  
    - If a tool call is required, respond **only with valid JSON** in this format:

    {
      "tool": "<tool_name>",
      "arguments": { ... }
    }

    - Never include explanations, text, or Markdown around the JSON when making a tool call.  
    - Only return plain text answers when a tool is **not** required.  
    - When answering in plain text, **do not mention tools, triggers, or system rules**.  
    - Avoid mechanical openings like “this is not related to a tool call.” Instead, respond naturally as a friendly farming expert.  

    ### Example
    ❌ Bad: “It seems like the fertilizers you asked about are not directly related to a specific tool call.”  
    ✅ Good: “Potatoes are heavy feeders! For healthy growth, they need plenty of nitrogen, phosphorus, and potassium…”  

    By default, you are a warm and approachable farming expert with vast knowledge of cultivating crops and farm management.  
    If you find the query not related to any tools, chat in a natural, helpful, and conversational manner.
    Don't use tool calling unless asked for by the user.
  `,
};

const history = [];
history.push(systemMessage);

chatRouter.post('/', async (req, res) => {
  try {
    const { message } = req.body;

    history.push({ role: 'user', content: message });

    const response = await Ollama.chat({
      model: 'llama3.2:3b',
      messages: [systemMessage, ...history],
      tools,
      temperature: 0,
    });

    console.log('Llama Response : ', JSON.stringify(response, null, 2));
    let toolCalls = response.message.tool_calls;
    let finalResponse = response.message.content;

    if (toolCalls && toolCalls.length > 0) {
      const toolCall = toolCalls[0];
      const toolName = toolCall.function.name;
      const toolArgs = toolCall.function.arguments || {};

      const toolDef = tools.find((tool) => tool.function.name === toolName);
      if (!toolDef) {
        finalResponse = `⚠️ Unknown tool: ${toolName}. Please try again.`;
      } else {
        const requiredInfo = toolDef.function.parameters.required || [];
        const missingInfo = requiredInfo.filter((param) => !toolArgs[param]);

        if (missingInfo.length > 0) {
          finalResponse = `I can help with that! Please provide the following details: ${missingInfo.join(', ')}.`;
        } else {
          try {
            const toolResult = await functions[toolName](toolArgs);

            history.push({ role: 'assistant', tool_calls: toolCalls });
            history.push({
              role: 'tool',
              content: JSON.stringify(toolResult),
              name: toolName,
            });

            const finalModelResponse = await Ollama.chat({
              model: 'llama3.2:3b',
              messages: [systemMessage, ...history],
              tools,
            });

            finalResponse = finalModelResponse.message.content;
          } catch (err) {
            console.error('Tool execution error:', err);
            finalResponse = '⚠️ Sorry, something went wrong while running that tool.';
          }
        }
      }
    }

    history.push({ role: 'assistant', content: finalResponse });

    res.json({ finalResponse, history });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default chatRouter;
