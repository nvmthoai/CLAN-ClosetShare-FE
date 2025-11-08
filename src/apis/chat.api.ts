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
      // In local dev call through the Vite proxy '/api/n8n' which rewrites to the working n8n webhook
      const res = await fetch("/api/n8n", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(`n8n webhook error ${res.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await res.json();
      return { data } as any;
    } else {
      // In production, use direct URL or Vercel serverless function
      const response = await axios.post<ChatResponse>(
        "https://nvmthoai3.app.n8n.cloud/webhook/fb7bf781-87a8-4368-885d-555fd67390d7/chat",
        payload,
        {
          headers: buildHeaders(),
        }
      );
      return response;
    }
  },

  // Recommend outfit - uses proxy in development, direct call in production
  recommendOutfit: async (payload: RecommendOutfitRequest) => {
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment) {
      // In local dev call the known working n8n webhook directly to avoid proxy 500 errors
      const WEBHOOK_URL = "https://nvmthoai1.app.n8n.cloud/webhook/recommend-outfit";
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.text().catch(() => "(no body)");
        throw new Error(`n8n webhook error ${res.status}: ${body}`);
      }

      const data = await res.json();
      return { data } as any;
    } else {
      // In production, use direct URL
      const response = await axios.post<RecommendOutfitResponse>(
        "https://nvmthoai3.app.n8n.cloud/webhook/recommend-outfit",
        payload,
        {
          headers: buildHeaders(),
        }
      );
      return response;
    }
  },
};

