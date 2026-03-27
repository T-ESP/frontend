export type RegisterRequest = {
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
};

export type RegisterResult = {
  message: string;
};

export interface RegisterUserGateway {
  register(payload: RegisterRequest): Promise<RegisterResult>;
}
