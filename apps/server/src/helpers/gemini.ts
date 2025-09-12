import { GoogleGenAI, type FunctionDeclaration } from '@google/genai';
import type { Response } from 'express';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const getPlantDisease: FunctionDeclaration = {
  name: 'getPlantDisease',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      image: { type: 'string' }, // Base64 encoded image or path to the image
    },
    required: ['image'], // Image is required for disease detection
  },
};

const getCropSuggestion: FunctionDeclaration = {
  name: 'getCropSuggestion',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      season: { type: 'string' }, // e.g., 'winter', 'summer'
      region: { type: 'string' }, // e.g., 'north', 'south'
    },
    required: ['season', 'region'], // Season and region are required
  },
};

const analyzeCropSuggestion: FunctionDeclaration = {
  name: 'analyzeCropSuggestion',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      cropSuggestion: { type: 'string' }, // Description of the suggested crop
      trends: { type: 'string' }, // Current agricultural trends
    },
    required: ['cropSuggestion', 'trends'], // Crop suggestion and trends must be provided
  },
};

const getGeolocation: FunctionDeclaration = {
  name: 'getGeolocation',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      address: { type: 'string' }, // Address to get the latitude and longitude
    },
    required: ['address'], // Address is required
  },
};

const getMarketStats: FunctionDeclaration = {
  name: 'getMarketStats',
  parametersJsonSchema: {
    type: 'object',
    properties: {
      crop: { type: 'string' }, // Crop name to get market stats
    },
    required: ['crop'], // Crop name is required
  },
};

async function streamChatbotResponse(userMessage: string, res: Response) {
  const response = await ai.models.generateContentStream({
    model: 'gemini-2.0-flash-001',
    contents: userMessage,
    config: {
      toolConfig: {
        functionCallingConfig: {
          mode: FunctionCallingConfigMode.ANY, // Enable calling any function
          allowedFunctionNames: [
            'getPlantDisease',
            'getCropSuggestion',
            'analyzeCropSuggestion',
            'getGeolocation',
            'getMarketStats',
          ], // List all the allowed functions
        },
      },
      tools: [
        { functionDeclarations: [getPlantDisease] },
        { functionDeclarations: [getCropSuggestion] },
        { functionDeclarations: [analyzeCropSuggestion] },
        { functionDeclarations: [getGeolocation] },
        { functionDeclarations: [getMarketStats] },
      ],
    },
  });

  // Process the response from Gemini's function call
  for await (const chunk of response) {
    const message = chunk.toString();
    console.log('Received Chunk: ', message);
    res.write(`data: ${message}\n\n`);
  }
}
