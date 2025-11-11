// Vercel Serverless Function to proxy chat requests to n8n
// This avoids CORS issues by making the request from the server

export default async function handler(req: any, res: any) {
  // Support CORS preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Access-Token");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const DEFAULT_WEBHOOK =
      "https://nvmthoai3.app.n8n.cloud/webhook/fb7bf781-87a8-4368-885d-555fd67390d7/chat";

    // Allow overriding the target webhook via env var for flexibility
    const target = process.env.N8N_CHAT_WEBHOOK || DEFAULT_WEBHOOK;

    // If an auth value is provided in the environment, use it (e.g. "Basic xxx")
    const envAuth = process.env.N8N_CHAT_AUTH;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (envAuth) headers["Authorization"] = envAuth;

    // Forward the request body to n8n
    const response = await fetch(target, {
      method: "POST",
      headers,
      body: JSON.stringify(req.body),
    });

    // Read raw text and mirror content-type/status to the client to avoid JSON parse errors
    const text = await response.text().catch(() => "");
    const contentType = response.headers.get("content-type") || "text/plain";
    res.setHeader("Content-Type", contentType);

    return res.status(response.status).send(text);
  } catch (error: any) {
    console.error("Chat proxy error:", error);
    return res.status(500).json({
      error: "Failed to process chat request",
      message: String(error?.message || error),
    });
  }
}


