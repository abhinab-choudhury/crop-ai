import Ollama from 'ollama';
import express from 'express';
import crop_disease_prediction from '../utils/crop-disease-prediction.js';
import crop_prediction from '../utils/crop-prediction.js';
import get_crop_rotation from '../utils/get-crop-rotation.js';
import { sendResponse } from '../utils/response-handler.js';

const chatRouter = express.Router();

const functions = {
  get_crop_rotation: async (args) => await get_crop_rotation(args),
  crop_disease_prediction: async (args) => await crop_disease_prediction(args.file_url),
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
          N: { type: 'number' },
          P: { type: 'number' },
          K: { type: 'number' },
          pH: { type: 'number' },
          state: { type: 'string' },
          city: { type: 'string' },
          language: { type: 'string' },
        },
        required: ['state', 'city', 'language'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'crop_disease_prediction',
      description: 'Analyzes a crop photo for diseases.',
      parameters: {
        type: 'object',
        properties: { file_url: { type: 'string' } },
        required: ['file_url'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'crop_prediction',
      description:
        'Predicts the best crop to grow now based on soil nutrients, climate, and location.',
      parameters: {
        type: 'object',
        properties: {
          nitrogen: { type: 'number' },
          phosphorous: { type: 'number' },
          pottasium: { type: 'number' },
          ph: { type: 'number' },
          rainfall: { type: 'number' },
          lat: { type: 'number' },
          lon: { type: 'number' },
        },
        required: ['nitrogen', 'phosphorous', 'pottasium', 'ph', 'rainfall', 'lat', 'lon'],
      },
    },
  },
];

// SYSTEM PROMPT (strict rules for tool calling)
const systemMessage = {
  role: 'system',
  content: `
    You are a friendly AI agricultural assistant.

    TOOLS RULES:
    1. Only call a tool if the user's intent clearly matches one of the tools.
    2. Never call a tool if required parameters are missing.
    3. If parameters are missing, ask clarifying questions.
    4. Tool call format MUST be JSON only:
      {"tool": "<tool_name>", "arguments": {...}}
    5. Do not hallucinate missing info.
    6. Only respond with text if tool call is not needed.
  `,
};

const history = [systemMessage];

// PRE-CHECK: decide if a tool should be called
function getToolToCall(message, image_uri) {
  if (/rotation|plan|schedule|multi-season/i.test(message)) return 'get_crop_rotation';
  if (/what should I grow/i.test(message) && /soil|weather|location/i.test(message))
    return 'crop_prediction';
  if (image_uri) return 'crop_disease_prediction';
  return null;
}

// VALIDATE required parameters
function validateToolParams(toolName, body) {
  const toolDef = tools.find((t) => t.function.name === toolName);
  if (!toolDef) return { valid: false, missing: [] };

  const required = toolDef.function.parameters.required || [];
  const missing = required.filter(
    (param) => !(param in body) && !(param === 'file_url' && body.image_uri),
  );
  return { valid: missing.length === 0, missing };
}

chatRouter.post('/', async (req, res) => {
  try {
    const { message, image_uri, ...rest } = req.body;
    console.log('req.body: ', message, image_uri);
    if (!message) return res.json(sendResponse(res, 400, 'message field is missing'));

    const userContent = image_uri ? `${message}\n\n[Image provided: ${image_uri}]` : message;
    history.push({ role: 'user', content: userContent });

    const toolName = getToolToCall(message, image_uri);
    let toolsToSend = [];

    if (toolName) {
      const { valid, missing } = validateToolParams(toolName, { ...rest, image_uri });
      if (!valid) {
        const responseText = `I need more info to assist you: ${missing.join(', ')}`;
        history.push({ role: 'assistant', content: responseText });
        return res.json(
          sendResponse(res, 200, 'AI assistant response', { finalResponse: responseText, history }),
        );
      }
      toolsToSend = tools; // only include tools if needed
    }

    const response = await Ollama.chat({
      model: 'llama3.2:3b',
      messages: history,
      tools: toolsToSend,
      temperature: 0,
    });

    let finalResponse = response.message.content;

    if (response.message.tool_calls?.length) {
      const toolCall = response.message.tool_calls[0];
      const toolCallName = toolCall.function.name;
      const toolArgs = toolCall.function.arguments || {};

      if (functions[toolCallName]) {
        const toolResult = await functions[toolCallName](toolArgs);
        history.push({ role: 'assistant', tool_calls: [toolCall] });
        history.push({ role: 'tool', content: JSON.stringify(toolResult), name: toolCallName });

        const finalModelResponse = await Ollama.chat({
          model: 'llama3.2:3b',
          messages: history,
          tools: toolsToSend,
        });
        finalResponse = finalModelResponse.message.content;
      }
    }

    history.push({ role: 'assistant', content: finalResponse });

    res.json(sendResponse(res, 200, 'AI assistant response', { finalResponse, history }));
  } catch (err) {
    console.error('Chat error:', err);
    res.json(sendResponse(res, 500, 'Internal server error', err.message || ''));
  }
});

export default chatRouter;
