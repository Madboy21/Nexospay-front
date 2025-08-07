import axios from 'axios';

const API = axios.create({
  baseURL: 'https://nexospay-backend.vercel.app/api',
});

export default API;
