import type {
  LoginRequest,
  LoginResponse,
  LoginUserGateway,
} from "@/application/usecases/LoginUser/LoginUser.types";
import { getApiUrl } from "@/lib/api-url";

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

  constructor(baseUrl: string = getApiUrl()) {
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

    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_firstname', firstname);
    localStorage.setItem('auth_lastname', lastname);
    localStorage.setItem('auth_email', payload.email);

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      if (decoded.commerce_id) {
        localStorage.setItem('commerce_id', decoded.commerce_id);
      }
      if (decoded.slug) {
        localStorage.setItem('commerce_slug', decoded.slug);
      }
    } catch {
      // JWT decode failed — skip
    }

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
