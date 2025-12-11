import type {
  RegisterRequest,
  RegisterResult,
  RegisterUserGateway,
} from "@/application/usecases/RegisterUser/RegisterUser.types";

const DEFAULT_API_URL = import.meta.env.VITE_API_URL || "http://localhost:8090";

export class HttpRegisterUserGateway implements RegisterUserGateway {
  private readonly baseUrl: string;

  constructor(baseUrl: string = DEFAULT_API_URL) {
    this.baseUrl = baseUrl;
  }

  async register(payload: RegisterRequest): Promise<RegisterResult> {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const maybeJson = await this.safeJson(response);

    if (!response.ok) {
      const errorMessage =
        (maybeJson && (maybeJson.message as string | undefined)) ??
        "Unable to create account.";
      throw new Error(errorMessage);
    }

    return {
      message:
        (maybeJson && (maybeJson.message as string | undefined)) ??
        "Account created successfully.",
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

