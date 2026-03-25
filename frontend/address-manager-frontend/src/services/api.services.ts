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
    const status = error.response?.status;

    // Adicionamos o 403 na verificação, pois seu backend está respondendo assim para tokens expirados
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('@App:refreshToken');
      
      // Se não existe nem refresh token, não adianta tentar; limpa tudo e vai para o login
      if (!refreshToken) {
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // Tenta renovar o token
        const response = await authService.refresh({ refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response;

        localStorage.setItem('@App:token', accessToken);
        localStorage.setItem('@App:refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se o refresh falhar (refresh token expirado), LIMPEZA TOTAL
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Função auxiliar para garantir que o storage seja limpo e o usuário redirecionado
const handleLogout = () => {
  localStorage.removeItem('@App:token');
  localStorage.removeItem('@App:refreshToken');
  localStorage.removeItem('@App:user');
  // Use replace para o usuário não conseguir "voltar" para a página protegida
  window.location.replace('/login');
};

export default api;