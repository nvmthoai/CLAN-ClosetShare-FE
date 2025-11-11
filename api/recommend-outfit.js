// Vercel serverless function to forward recommend-outfit requests to n8n.
const DEFAULT_WEBHOOK =
  "https://nvmthoai3.app.n8n.cloud/webhook/recommend-outfit";

module.exports = async (req, res) => {
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
    const target = process.env.N8N_RECOMMEND_WEBHOOK || DEFAULT_WEBHOOK;

    const forwardHeaders = {
      "Content-Type": "application/json",
    };
    if (req.headers.authorization) {
      forwardHeaders["Authorization"] = req.headers.authorization;
    }
    if (req.headers["x-access-token"]) {
      forwardHeaders["X-Access-Token"] = req.headers["x-access-token"];
    }

    const fetchFn = global.fetch || (await import("node-fetch")).default;

    const response = await fetchFn(target, {
      method: "POST",
      headers: forwardHeaders,
      body: JSON.stringify(req.body),
    });

    const text = await response.text().catch(() => "");
    const contentType = response.headers.get("content-type") || "text/plain";
    res.setHeader("Content-Type", contentType);
    return res.status(response.status).send(text);
  } catch (err) {
    console.error("/api/recommend-outfit proxy error:", err);
    return res.status(500).json({ error: "Proxy error", details: String(err) });
  }
};
