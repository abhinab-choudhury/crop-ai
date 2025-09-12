import 'dotenv/config';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import { chatRouter } from './routers/chat';

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'OPTIONS'],
  }),
);

app.use(express.json());

app.get('/', (_req: Request, res: Response) => {
  return res.status(200).send('OK');
});

app.post('/chat', chatRouter);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
