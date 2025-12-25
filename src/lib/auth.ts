// src/lib/auth.ts
/**
 * Authentication utilities
 * Now using httpOnly cookies for secure token storage
 * Tokens are managed by backend and sent automatically via cookies
 */

const LOGIN_URL = "/login";

/**
 * Check if user is authenticated
 * We'll rely on API calls with cookies - if API returns 401, user is not authenticated
 */
export function isAuthenticated(): boolean {
  // In cookie-based auth, we check if user info exists in store
  // The actual auth state is managed by the auth store
  return true; // Let the auth store handle this
}

/**
 * Redirect to login page
 */
export function redirectToLogin(): never {
  window.location.href = LOGIN_URL;
  
  throw new Error("No token available, redirecting to login");
}

