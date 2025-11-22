import axios from "axios";
import { getAccessToken } from "@/lib/token";

export interface ChatRequest {
  chatInput: string;
  sessionId: string;
  userId: string;
}

export interface ChatResponse {
  chatOutput: string;
}

export interface RecommendOutfitRequest {
  chatInput: string;
  sessionId: string;
}

export interface RecommendOutfitResponse {
  chatOutput?: string;
  [key: string]: any; // Allow other response fields
}

const buildHeaders = () => {
  const auth = btoa("botuser:supersecret");
  const headers: Record<string, string> = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/json",
  };
  const accessToken = getAccessToken();
  if (accessToken) {
    headers["X-Access-Token"] = `Bearer ${accessToken}`;
  }
  return headers;
};

export const chatApi = {
  // Send chat message - uses proxy in development, direct call in production
  sendMessage: async (payload: ChatRequest) => {
    // In development: use /api/chat which is proxied by Vite
    // In production: can use direct URL or Vercel serverless function
    const isDevelopment = import.meta.env.DEV;

    if (isDevelopment) {
      // In local dev call the exact n8n webhook URL you tested in Postman.
      // This avoids issues if the local Vite proxy is misconfigured and returning 500s.
      const WEBHOOK_URL =
        "https://nvmthoai123.app.n8n.cloud/webhook/fc1aa0bb-d14d-4ba3-859e-e69fc31a22c8/chat";
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text().catch(() => "");
      // Try to parse JSON, otherwise keep raw text
      let parsed: any = undefined;
      try {
        parsed = raw ? JSON.parse(raw) : undefined;
      } catch (e) {
        parsed = raw;
      }

      if (!res.ok) {
        // include raw body for easier debugging
        throw new Error(
          `n8n webhook error ${res.status}: ${raw || JSON.stringify(parsed)}`
        );
      }

      return { data: parsed } as any;
    } else {
      // In production, use direct URL or Vercel serverless function
      // Production: call the Vercel serverless proxy on the same origin so the browser
      // doesn't make a cross-origin request directly to n8n (which triggers CORS).
      const response = await axios.post<ChatResponse>("/api/chat", payload, {
        headers: buildHeaders(),
      });
      return response;
    }
  },

  // Recommend outfit - uses proxy in development, direct call in production
  recommendOutfit: async (payload: RecommendOutfitRequest) => {
    const isDevelopment = import.meta.env.DEV;

    if (isDevelopment) {
      // In local dev call the known working n8n webhook directly to avoid proxy 500 errors
      const WEBHOOK_URL =
        "https://nvmthoai1.app.n8n.cloud/webhook/recommend-outfit";
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const status = res.status;
      const raw = await res.text().catch(() => "");

      if (!res.ok) {
        // Include raw body for easier debugging
        throw new Error(`n8n webhook error ${status}: ${raw || "(no body)"}`);
      }

      // Try to parse JSON, fall back to raw text
      let data: any = undefined;
      try {
        data = raw ? JSON.parse(raw) : undefined;
      } catch (e) {
        data = raw;
      }

      return { data } as any;
    } else {
      // In production, use direct URL
      // Production: call the serverless proxy endpoint which forwards to n8n.
      const response = await axios.post<RecommendOutfitResponse>(
        "/api/recommend-outfit",
        payload,
        {
          headers: buildHeaders(),
        }
      );
      return response;
    }
  },
};
