import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
});

const mlApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_ML_SERVER_URL,
});

export { api, mlApi };
