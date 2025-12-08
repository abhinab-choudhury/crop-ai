import express from 'express';
import ollama from 'ollama';

import { sendResponse } from '../utils/response-handler.js';
import { tools, toolFunctions } from '../utils/tool.js';

const router = express.Router();

async function runOllamaTools(messages) {
  while (true) {
    const response = await ollama.chat({
      model: 'llama3.2:3b',
      messages,
      tools,
    });

    messages.push(response.message);

    const calls = response.message.tool_calls;
    if (!calls || calls.length === 0) break; // no tools → final answer

    for (const call of calls) {
      const fn = toolFunctions[call.function.name];
      if (!fn) continue;

      const result = await fn(call.function.arguments);

      messages.push({
        role: 'tool',
        tool_name: call.function.name,
        content: JSON.stringify(result),
      });
    }
  }

  return messages[messages.length - 1].content;
}

router.post('/', async (req, res) => {
  try {
    const { message, image_uri } = req.body;

    if (!message) {
      return res.json(sendResponse(res, 400, 'Message is required'));
    }

    const userContent = image_uri ? `${message}\n[Image: ${image_uri}]` : message;

    const messages = [
      {
        role: 'system',
        content: 'You are CropAI — Use tools whenever helpful. NEVER guess missing parameters.',
      },
      {
        role: 'user',
        content: userContent,
      },
    ];

    const finalResponse = await runOllamaTools(messages);

    console.log('\n\nFINAL RESPONSE =', finalResponse, '\n\n');

    let parsedResponse = finalResponse;
    if (typeof finalResponse === 'string') {
      try {
        parsedResponse = JSON.parse(finalResponse);
      } catch (e) {
        parsedResponse = finalResponse;
      }
    }

    return res.json(
      sendResponse(res, 200, 'AI assistant response', { finalResponse: parsedResponse }),
    );
  } catch (err) {
    console.error('❌ Error in chat:', err);
    return res.json(sendResponse(res, 500, 'Internal error', err.message));
  }
});

export default router;
