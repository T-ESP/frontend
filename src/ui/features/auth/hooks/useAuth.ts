import { useState, useEffect } from "react";

const TOKEN_KEY = "auth_token";

function isJwtExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (typeof payload.exp !== "number") return false;
    return Date.now() / 1000 > payload.exp;
  } catch {
    return false;
  }
}

/**
 * Le backend a 4 rôles (platform_admin, commerce, employee, manager) mais le
 * routing front n'en connaît que 2 (admin = accès complet, manager = accès
 * opérationnel). Le compte commerce (gérant) devient "admin" ; un employé
 * devient "manager" tant qu'on n'a pas de granularité plus fine côté UI.
 */
function mapBackendRole(backendRole: string | undefined): "admin" | "manager" {
  if (backendRole === "commerce" || backendRole === "platform_admin") return "admin";
  return "manager";
}

/** Décode un JWT backend et persiste tout ce dont l'UI a besoin en localStorage. */
export function storeAuthFromToken(token: string, email?: string) {
  try {
    const decoded: Record<string, unknown> = JSON.parse(atob(token.split(".")[1]));

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem("auth_email", email ?? (decoded.email as string) ?? "");

    if (decoded.commerce_id) {
      localStorage.setItem("commerce_id", String(decoded.commerce_id));
    }
    if (decoded.slug) {
      localStorage.setItem("commerce_slug", String(decoded.slug));
    }

    const backendRole = decoded.role as string | undefined;
    localStorage.setItem("auth_role", mapBackendRole(backendRole));
    localStorage.setItem("auth_role_raw", backendRole ?? "");

    if (decoded.staff_id !== null && decoded.staff_id !== undefined) {
      localStorage.setItem("auth_staff_id", String(decoded.staff_id));
    } else {
      localStorage.removeItem("auth_staff_id");
    }
  } catch {
    // JWT decode failed — rien à stocker
  }
}

export function getAuthToken(): string | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && isJwtExpired(token)) {
      clearAuthToken();
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function clearAuthToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("auth_firstname");
    localStorage.removeItem("auth_lastname");
    localStorage.removeItem("auth_email");
    localStorage.removeItem("commerce_id");
    localStorage.removeItem("commerce_slug");
    localStorage.removeItem("auth_role");
    localStorage.removeItem("auth_role_raw");
    localStorage.removeItem("auth_staff_id");
  } catch {
    // ignore
  }
}

/** Reads a localStorage value reactively (re-reads on storage events). */
function useLocalStorage(key: string): string | null {
  const [value, setValue] = useState<string | null>(() => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === key || e.key === null) {
        setValue(localStorage.getItem(key));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [key]);

  return value;
}

export function useAuth() {
  const token = useLocalStorage(TOKEN_KEY);

  const isAuthenticated = !!token;

  const role = useLocalStorage("auth_role") ?? "manager";
  const roleRaw = useLocalStorage("auth_role_raw") ?? "";
  const staffIdRaw = useLocalStorage("auth_staff_id");
  const staffId = staffIdRaw !== null ? Number(staffIdRaw) : null;
  /** true si connecté en tant qu'employé (pas le compte commerce lui-même). */
  const isEmployee = staffId !== null;

  const firstname = useLocalStorage("auth_firstname") ?? "";
  const lastname = useLocalStorage("auth_lastname") ?? "";
  const email = useLocalStorage("auth_email") ?? "";

  return {
    token,
    isAuthenticated,
    role,
    roleRaw,
    staffId,
    isEmployee,
    firstname,
    lastname,
    email,
  };
}
