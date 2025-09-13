import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import cropRotationRouter from './routes/crop-rotation.js';
import chatRouter from './routes/chat.js';
import cropDiseaseRouter from './routes/crop-disease.js';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

app.use('/api/crop-rotation', cropRotationRouter);
app.use('/api/crop-disease-detection', cropDiseaseRouter);
app.use('/api/chat', chatRouter);
app.get('', (_req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port ${PORT}`);
});
