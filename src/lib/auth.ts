// src/lib/auth.ts
const TOKEN_STORAGE_KEY = "auth_token";

const TOKEN_COOKIE_NAME =
  import.meta.env.VITE_AUTH_TOKEN_COOKIE_NAME || "token";

const LOGIN_URL =
  import.meta.env.VITE_AUTH_LOGIN_URL || "http://localhost/";

/**
 * Ambil token dari cookie browser.
 */
function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;

  const raw = document.cookie; // contoh: "token=abc.xyz; other=123"
  const parts = raw.split(";").map((c) => c.trim());

  const match = parts.find((c) =>
    c.startsWith(`${TOKEN_COOKIE_NAME}=`),
  );

  if (!match) return null;

  const value = match.split("=", 2)[1];
  if (!value) return null;

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Ambil token yang bisa dipakai FE:
 * 1. Coba dari localStorage
 * 2. Kalau belum ada, baca dari cookie lalu simpan ke localStorage
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  let fromStorage = window.localStorage.getItem(TOKEN_STORAGE_KEY);
  if (fromStorage) {
    // Strip quotes from stored token if present
    fromStorage = fromStorage.replace(/^"|"$/g, '');
    // Update localStorage with cleaned token
    if (fromStorage !== window.localStorage.getItem(TOKEN_STORAGE_KEY)) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, fromStorage);
    }
    return fromStorage;
  }

  let fromCookie = getTokenFromCookie();
  if (fromCookie) {
    fromCookie = fromCookie.replace(/^"|"$/g, '');
    window.localStorage.setItem(TOKEN_STORAGE_KEY, fromCookie);
    return fromCookie;
  }

  return null;
}

/**
 * Opsi kalau nanti butuh set token manual.
 */
export function setToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

/**
 * Opsi kalau nanti butuh logout.
 */
export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
}

/**
 * Kalau token tidak ada, redirect ke facade login.
 */
export function redirectToLogin(): never {
  const current = encodeURIComponent(window.location.href);
  const base = LOGIN_URL.endsWith("/") ? LOGIN_URL : LOGIN_URL + "/";
  window.location.href = `${base}?redirect=${current}`;
  throw new Error("No token available, redirecting to login");
}
