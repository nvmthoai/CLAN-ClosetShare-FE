import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens, isValidToken } from "@/lib/token";

let BASE_URL =
  import.meta.env.VITE_BASE_URL || import.meta.env.VITE_API_BASE_URL || "/api";

// Safety: if the page is loaded over HTTPS in the browser but BASE_URL is an
// explicit http:// origin, the browser will block requests (Mixed Content).
// When running in a browser on HTTPS, prefer the relative proxy path `/api`
// so hosting platforms (Vercel) can rewrite/proxy to the backend. This
// avoids mixed-content errors when the backend doesn't have HTTPS.
if (typeof window !== "undefined") {
  try {
    const runningOverHttps = window.location.protocol === "https:";
    if (runningOverHttps && typeof BASE_URL === "string" && BASE_URL.startsWith("http://")) {
      // Use relative proxy to avoid mixed content
      // NOTE: for production it's recommended to set VITE_BASE_URL to '/api'
      // or enable HTTPS on the backend.
      // Keep a console message for easier debugging.
      // eslint-disable-next-line no-console
      console.warn(
        `[fetcher] Page loaded over HTTPS but BASE_URL is insecure (${BASE_URL}). Falling back to '/api' to avoid mixed content.`
      );
      BASE_URL = "/api";
    }
  } catch (e) {
    // ignore environment where `window` exists but access throws
  }
}

export const fetcher = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Automatically add access token to all requests
fetcher.interceptors.request.use(
  (config) => {
    // Get access token from centralized token manager
    const token = getAccessToken();
    
    // Always add token if it exists (even if format validation fails)
    // This ensures all authenticated requests have the token
    if (token) {
      // Validate token format (optional check)
      if (!isValidToken(token)) {
        console.warn("[fetcher] Token format validation failed, but adding to request anyway");
      }
      
      // Always add token to Authorization header
      config.headers["Authorization"] = `Bearer ${token}`;
      
      // Debug log (only in development)
      if (import.meta.env.DEV) {
        console.log(`[fetcher] Adding token to ${config.method?.toUpperCase()} ${config.url}`);
      }
    } else {
      // Log when no token is available (only in development)
      if (import.meta.env.DEV) {
        console.log(`[fetcher] No token available for ${config.method?.toUpperCase()} ${config.url}`);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle token refresh on 401 errors
fetcher.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        
        if (!refreshToken || !isValidToken(refreshToken)) {
          throw new Error("No valid refresh token available");
        }

        // Attempt to refresh the access token
        const refreshResponse = await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {
            refresh_token: refreshToken,
          },
          {
            // Don't use fetcher here to avoid infinite loop
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const responseData = refreshResponse.data?.data || refreshResponse.data;
        const newAccessToken = responseData?.access_token || responseData?.accessToken;
        const newRefreshToken = responseData?.refresh_token || responseData?.refreshToken;

        if (newAccessToken && isValidToken(newAccessToken)) {
          // Save new tokens
          setTokens(newAccessToken, newRefreshToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return fetcher(originalRequest);
        } else {
          throw new Error("Invalid token format in refresh response");
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        console.error("[fetcher] Token refresh failed:", refreshError);
        clearTokens();
        localStorage.removeItem("user_id");
        localStorage.removeItem("user_data");
        localStorage.removeItem("user_role");

        // Redirect to login if we're in browser
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
