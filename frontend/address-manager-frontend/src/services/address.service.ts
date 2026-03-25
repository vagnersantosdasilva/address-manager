// src/services/userService.ts

import type { Address, AddressPartial } from "../models/address.model";
import api from "./api.services";

export const addressService = {
 
  getAll: async (idUser:number): Promise<Address[]> => {
    const response = await api.get<Address[]>(`api/user/${idUser}/address`);
    return response.data;
  },
  
  create: async (idUser:number, addressData: Address ): Promise<Address> => {
    const response = await api.post<Address>(`api/user/${idUser}/address`, addressData);
    return response.data;
  },

  delete: async (idUser: number, idAddress: number): Promise<void> => {
    await api.delete(`/users/${idUser}/address/${idAddress}`);
  },

  update: async(idUser:number , idAddress:number, userData:Address): Promise<Address> => {
    const response = await api.put<Address>(`api/user/${idUser}/address/${idAddress}`,userData)
    return response.data;
  },
  
  zipcode : async(idUser:number, cep:string): Promise<AddressPartial> => {
    const response = await api.get<AddressPartial>(`api/user/${idUser}/zipcode/${cep}`)
    return response.data
  }

};