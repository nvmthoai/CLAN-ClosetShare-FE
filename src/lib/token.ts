/**
 * Token Management Utility
 * Centralized token storage and retrieval for API requests
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Get access token from localStorage
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Set access token to localStorage
 */
export function setAccessToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

/**
 * Set refresh token to localStorage
 */
export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

/**
 * Set both tokens
 */
export function setTokens(accessToken: string, refreshToken?: string): void {
  setAccessToken(accessToken);
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
}

/**
 * Clear all tokens
 */
export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Check if user is authenticated (has access token)
 */
export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

/**
 * Validate token format (basic check)
 */
export function isValidToken(token: string | null): boolean {
  if (!token || typeof token !== "string") return false;
  // Basic validation: token should not be empty and should have reasonable length
  return token.trim().length > 10;
}

