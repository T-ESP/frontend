import { useState, useEffect } from "react";

const TOKEN_KEY = "auth_token";

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
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

  // Pour l'instant, on n'a pas de rôle dans le JWT → rôle par défaut
  const role = "admin";

  const firstname = useLocalStorage("auth_firstname") ?? "";
  const lastname = useLocalStorage("auth_lastname") ?? "";
  const email = useLocalStorage("auth_email") ?? "";

  return {
    token,
    isAuthenticated,
    role,
    firstname,
    lastname,
    email,
  };
}
