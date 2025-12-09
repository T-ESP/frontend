import type { LoginRequest, LoginResponse, LoginUserGateway } from "./LoginUser.types";
import { clearAuthToken, getAuthToken } from "@/features/auth/hooks/useAuth";

export function createLoginUserUsecase(gateway: LoginUserGateway) {
  return async (request: LoginRequest): Promise<LoginResponse> => {
    const payload: LoginRequest = {
      email: request.email.trim(),
      password: request.password,
    };

    // Nettoyer éventuellement un ancien token avant de se connecter
    clearAuthToken();

    const response = await gateway.login(payload);

    // Stockage simple du token pour que le layout/ProtectedRoute puissent le lire
    try {
      localStorage.setItem("auth_token", response.token);
    } catch {
      // ignore storage errors
    }

    return response;
  };
}


