import dotenv from 'dotenv';
dotenv.config();

const env = {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  ML_SERVER: process.env.ML_SERVER,
  TAVILY_API_KEY: process.env.TAVILY_API_KEY,
  WEATHER_KEY: process.env.WEATHER_KEY,
};

export default env;
