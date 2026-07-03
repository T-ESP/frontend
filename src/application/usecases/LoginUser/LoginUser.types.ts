export type LoginRequest = {
  email: string;
  password: string;
  /** Nom/slug de la boutique — requis pour se connecter en tant qu'employé
   * (son email n'est unique que dans son commerce, pas globalement). */
  commerceSlug?: string;
};

export type LoginResponse = {
  success: boolean;
  token: string;
  firstname: string;
  lastname: string;
  slug?: string;
  role?: string;
  message?: string;
};

export interface LoginUserGateway {
  login(payload: LoginRequest): Promise<LoginResponse>;
}
