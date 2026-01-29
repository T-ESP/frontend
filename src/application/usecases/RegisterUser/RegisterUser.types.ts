export type RegisterRequest = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type RegisterResult = {
  message?: string;
};

export interface RegisterUserGateway {
  register(payload: RegisterRequest): Promise<RegisterResult>;
}