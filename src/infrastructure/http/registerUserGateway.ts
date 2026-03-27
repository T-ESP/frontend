import type {
  RegisterRequest,
  RegisterResult,
  RegisterUserGateway,
} from "@/application/usecases/RegisterUser/RegisterUser.types";
import { getApiUrl } from "@/lib/api-url";

export class HttpRegisterUserGateway implements RegisterUserGateway {
  private readonly baseUrl: string;

  constructor(baseUrl: string = getApiUrl()) {
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
