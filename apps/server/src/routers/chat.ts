import { streamChatbotResponse } from '@/helpers/gemini';
import express from 'express';

export const chatRouter = express.Router();

chatRouter.get('/chat', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const userMessage = req.query.message as string;

  if (!userMessage) {
    return res.status(400).send('Message parameter is required.');
  }

  streamChatbotResponse(userMessage, res);
});
