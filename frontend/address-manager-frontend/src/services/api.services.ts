// src/services/api.ts
import axios, { type AxiosInstance } from 'axios';
import { authService } from './auth.service';
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 1. Injeta o Token em cada requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@App:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Trata expiração e faz o Refresh automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se erro for 401 e ainda não tentamos o refresh para esta requisição
    if ((error.response?.status === 401 ) && !originalRequest._retry) {
      originalRequest._retry = true; // Marca para não entrar em loop infinito

      try {
        const refreshToken = localStorage.getItem('@App:refreshToken');
        
        if (refreshToken) {
          // Tenta renovar o token
          const { accessToken, refreshToken: newRefreshToken } = await authService.refresh({ refreshToken });
          
          // Salva os novos tokens
          localStorage.setItem('@App:token', accessToken);
          localStorage.setItem('@App:refreshToken', newRefreshToken);

          // Atualiza o header da requisição que falhou e tenta de novo
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest); 
        }
      } catch (refreshError) {
        // Se o refresh token também expirou, aí sim desloga
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;