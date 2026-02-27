import type {
  LoginRequest,
  LoginResponse,
  LoginUserGateway,
} from "@/application/usecases/LoginUser/LoginUser.types";

const DEFAULT_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8090";

type RawLoginApiResponse = {
  success: boolean;
  data?: {
    token?: string;
    firstname?: string;
    lastname?: string;
  };
  message?: string;
};

export class HttpLoginUserGateway implements LoginUserGateway {
  private readonly baseUrl: string;

  constructor(baseUrl: string = DEFAULT_API_URL) {
    this.baseUrl = baseUrl;
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const body = (await this.safeJson(response)) as RawLoginApiResponse | null;

    if (!response.ok || !body || !body.success || !body.data?.token) {
      const message =
        body?.message ??
        (response.status === 401
          ? "Email ou mot de passe incorrect."
          : "Impossible de se connecter.");
      throw new Error(message);
    }

    const token = body.data.token;
    const firstname = body.data.firstname ?? "";
    const lastname = body.data.lastname ?? "";

    // Store token and names in localStorage for authenticated session
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_firstname', firstname);
    localStorage.setItem('auth_lastname', lastname);

    return {
      success: true,
      token,
      firstname,
      lastname,
      message: body.message ?? "Login successful",
    };
  }

  private async safeJson(response: Response) {
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return null;
    }

    try {
      return await response.json();
    } catch {
      return null;
    }
  }
}


