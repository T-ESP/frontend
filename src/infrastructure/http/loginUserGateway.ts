import type {
  LoginRequest,
  LoginResponse,
  LoginUserGateway,
} from "@/application/usecases/LoginUser/LoginUser.types";
import { getApiUrl } from "@/lib/api-url";
import { storeAuthFromToken } from "@/ui/features/auth/hooks/useAuth";

type RawLoginApiResponse = {
  success: boolean;
  data?: {
    token?: string;
    firstname?: string;
    lastname?: string;
  };
  message?: string;
};

type RawTenantVerifyResponse = {
  success: boolean;
  data?: {
    id?: string;
  };
  message?: string;
};

export class HttpLoginUserGateway implements LoginUserGateway {
  private readonly baseUrl: string;

  constructor(baseUrl: string = getApiUrl()) {
    this.baseUrl = baseUrl;
  }

  /** Résout le nom/slug d'une boutique en commerce_id via l'endpoint public. */
  private async resolveCommerceId(slug: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/tenants/verify/${encodeURIComponent(slug)}`);
    const body = (await this.safeJson(response)) as RawTenantVerifyResponse | null;

    if (!response.ok || !body?.success || !body.data?.id) {
      throw new Error("Boutique introuvable. Vérifiez le nom saisi.");
    }

    return body.data.id;
  }

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const commerceSlug = payload.commerceSlug?.trim();
    const commerceId = commerceSlug ? await this.resolveCommerceId(commerceSlug) : undefined;

    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        commerce_id: commerceId,
      }),
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

    storeAuthFromToken(token, payload.email);
    localStorage.setItem('auth_firstname', firstname);
    localStorage.setItem('auth_lastname', lastname);

    let slug: string | undefined;
    let role: string | undefined;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      slug = decoded.slug;
      role = decoded.role;
    } catch {
      // JWT decode failed — skip
    }

    return {
      success: true,
      token,
      firstname,
      lastname,
      slug,
      role,
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
