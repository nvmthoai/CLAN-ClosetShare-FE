import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const webhookUrl = process.env.N8N_CHAT_WEBHOOK_URL!;
    if (!webhookUrl) {
      throw new Error("Missing N8N_CHAT_WEBHOOK_URL env var");
    }

    const response = await axios.post(webhookUrl, req.body, {
      headers: { "Content-Type": "application/json" },
    });

    res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error("chat proxy error:", err.message);
    res
      .status(err.response?.status || 500)
      .json({ error: err.message, details: err.response?.data });
  }
}
