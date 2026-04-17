import { useMemo } from "react";

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
  } catch {
    // ignore
  }
}

export function useAuth() {
  const token = useMemo(() => getAuthToken(), []);

  const isAuthenticated = !!token;

  // Pour l’instant, on n’a pas de rôle dans le JWT → rôle par défaut
  const role = "admin";

  const firstname = useMemo(() => localStorage.getItem("auth_firstname") || "", []);
  const lastname = useMemo(() => localStorage.getItem("auth_lastname") || "", []);
  const email = useMemo(() => localStorage.getItem("auth_email") || "", []);

  return {
    token,
    isAuthenticated,
    role,
    firstname,
    lastname,
    email,
  };
}


