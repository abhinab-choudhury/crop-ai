import axios from 'axios';

const API_BASE = '';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10s timeout
});

export default api;
