import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import chatRouter from './routes/chat.js';
import env from './utils/env.js';
import { sendResponse } from './utils/response-handler.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(
  cors({
    origin: env.CORS_ORIGIN || '*',
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use('/uploads', express.static('uploads'));

app.use('/api/chat', chatRouter);
app.get('/health', (_req, res) => {
  res.json(sendResponse(res, 200, 'Node.js running'));
});
app.get('', (_req, res) => {
  res.status(200).render('index');
});

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server is listening on port http://localhost:${PORT}`);
});
