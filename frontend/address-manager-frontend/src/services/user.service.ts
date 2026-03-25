// src/services/userService.ts

import type { User } from "../models/user.model";
import api from "./api.services";

export const userService = {
 
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('api/user');
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`api/user/${id}`);
    return response.data;
  },

  getByCpf: async (cpf: string): Promise<User> => {
    const response = await api.get<User>(`api/user/cpf/${cpf}`);
    return response.data;
  },

  create: async (userData: User): Promise<User> => {
    const response = await api.post<User>('api/user', userData);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  update: async(id:number, userData:User): Promise<User> => {
    const response = await api.put<User>(`api/user/${id}`,userData)
    return response.data;
  },

  

};