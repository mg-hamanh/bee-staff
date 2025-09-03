// src/lib/server-api.ts
import axios from 'axios';
import { headers } from 'next/headers';

const serverApi = axios.create({
  baseURL: process.env.API_URL, // Không dùng NEXT_PUBLIC_
});

serverApi.interceptors.request.use(config => {
  const headersList = headers();
  const authHeader = await headersList.get('Authorization');
  if (authHeader) {
    config.headers.Authorization = authHeader;
  }
  return config;
});

export default serverApi;