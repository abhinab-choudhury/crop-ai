import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import chatRouter from './routes/chat.js';
import env from './utils/env.js';
import { sendResponse } from './utils/response-handler.js';
import upload from './utils/multer.js';

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
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

app.use('/api/chat', chatRouter);

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.json(sendResponse(res, 400, 'No file uploaded'));
  }

  res.json(
    sendResponse(res, 200, 'File uploaded successfully', {
      file_path: `uploads/${req.file.filename}`,
      original_name: req.file.originalname,
    }),
  );
});
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
