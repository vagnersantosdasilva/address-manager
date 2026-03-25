export interface Address {
  id?: number;  
  zipCode: string;      
  street: string;
  number: number;
  complement?: string;  
  neighborhood: string;
  city: string;
  state: string;       
  isMain: boolean;
  userId: number;      
}

export interface AddressPartial {
  zipCode?: string;
  street?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
}