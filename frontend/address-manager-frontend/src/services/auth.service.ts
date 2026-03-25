import type { login, refreshToken, tokenResponse } from "../models/auth.model";
import api from "./api.services";
import { userService } from "./user.service";

export const authService = {
  login: async (credentials: login): Promise<tokenResponse> => {
    const response = await api.post<tokenResponse>('/login', credentials);
    
    // O próprio serviço já salva os tokens se a requisição for sucesso
    if (response.data.accessToken) {
      localStorage.setItem('@App:token', response.data.accessToken);
      localStorage.setItem('@App:refreshToken', response.data.refreshToken);

     try {
        const user = await userService.getByCpf(credentials.cpf);
        localStorage.setItem('@App:user', JSON.stringify(user));
      } catch (error) {
        console.error("Erro ao buscar dados do usuário após login", error);
      }
    }

    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('@App:token');
    localStorage.removeItem('@App:refreshToken');
    window.location.href = '/login';
  },

  refresh: async (refreshToken: refreshToken): Promise<tokenResponse> => {
    const response = await api.post<tokenResponse>('/refresh-update', { refreshToken });
    return response.data;
  }
};