import express from 'express';
const app = express();
import { configDotenv } from 'dotenv';
import chatWithModel from './Routes/chatRoute.js';
// const cors = require('cors');

app.use(express.json());

// app.use('', require('./Routes/chatRoute'));
app.use('', chatWithModel);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server is listining to port ${PORT}`);
});