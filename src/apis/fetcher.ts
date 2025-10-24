import axios from "axios";

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

fetcher.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

fetcher.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const refreshResponse = await axios.post(
            `${BASE_URL}/auth/refresh-token`,
            {
              refresh_token: refreshToken,
            }
          );
          const newAccessToken = refreshResponse.data?.access_token;
          const newRefreshToken = refreshResponse.data?.refresh_token;
          if (newAccessToken) {
            localStorage.setItem("access_token", newAccessToken);
            if (newRefreshToken)
              localStorage.setItem("refresh_token", newRefreshToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return fetcher(originalRequest);
          }
        }
      } catch (refreshError) {
        console.log("Refresh token failed:", refreshError);
      }
      console.log("401 error: clearing tokens");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_role");

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
