// Simple Vercel serverless function that forwards POST requests to an n8n webhook.
// It reads the target webhook URL from the N8N_CHAT_WEBHOOK environment variable.
// This avoids browser CORS issues by performing the request server-side.

const DEFAULT_WEBHOOK =
  "https://nvmthoai3.app.n8n.cloud/webhook/fb7bf781-87a8-4368-885d-555fd67390d7/chat";

module.exports = async (req, res) => {
  // Allow preflight (shouldn't be necessary for same-origin calls, but safe)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Access-Token");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const target = process.env.N8N_CHAT_WEBHOOK || DEFAULT_WEBHOOK;

    // Build headers to forward to n8n. Copy common auth headers from the incoming request.
    const forwardHeaders = {
      "Content-Type": "application/json",
    };

    if (req.headers.authorization) {
      forwardHeaders["Authorization"] = req.headers.authorization;
    }
    if (req.headers["x-access-token"]) {
      forwardHeaders["X-Access-Token"] = req.headers["x-access-token"];
    }

    // Use global fetch (Node 18+ / Vercel runtime). Fallback to require('node-fetch') if needed.
    const fetchFn = global.fetch || (await import("node-fetch")).default;

    const response = await fetchFn(target, {
      method: "POST",
      headers: forwardHeaders,
      body: JSON.stringify(req.body),
    });

    const text = await response.text().catch(() => "");

    // Mirror status and content-type
    const contentType = response.headers.get("content-type") || "text/plain";
    res.setHeader("Content-Type", contentType);
    return res.status(response.status).send(text);
  } catch (err) {
    console.error("/api/chat proxy error:", err);
    return res.status(500).json({ error: "Proxy error", details: String(err) });
  }
};
