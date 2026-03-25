export interface tokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface refreshToken {
    refreshToken: string;
}

export interface login {
    cpf: string;
    password: string;
}

export interface AuthContextData {
   signed: boolean;
  loading: boolean;
  signIn(credentials: login): Promise<void>;
  logout(): void;
}