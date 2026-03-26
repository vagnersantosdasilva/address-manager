export interface UserLogin {
  cpf: string;
  password: string;
}

export interface User {
  id?: number,
  name: string,
  cpf: string,
  birthDate: string, // ISO format YYYY-MM-DD
  password?: string,
  userType?: 'ADMIN' | 'COMMON'
}

export interface UserPartial {
  name?: string,
  cpf?: string
  birthDate?: string,
  password?: string
}


