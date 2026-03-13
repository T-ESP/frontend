export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  token: string;
  firstname: string;
  lastname: string;
  message?: string;
};

export interface LoginUserGateway {
  login(payload: LoginRequest): Promise<LoginResponse>;
}


