// Vercel Serverless Function to proxy chat requests to n8n
// This avoids CORS issues by making the request from the server

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Encode Basic Auth
    const auth = Buffer.from("botuser:supersecret").toString("base64");

    // Forward request to n8n webhook
    const response = await fetch(
      "https://nvmthoai3.app.n8n.cloud/webhook/fb7bf781-87a8-4368-885d-555fd67390d7/chat",
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      }
    );

    if (!response.ok) {
      throw new Error(`n8n API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Return the response with CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Chat proxy error:", error);
    return res.status(500).json({ 
      error: "Failed to process chat request",
      message: error.message 
    });
  }
}


