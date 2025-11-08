import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/chat": {
        target: "https://nvmthoai3.app.n8n.cloud",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, "/webhook/fb7bf781-87a8-4368-885d-555fd67390d7/chat"),
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, _req, _res) => {
            // Add Basic Auth header
            const auth = Buffer.from("botuser:supersecret").toString("base64");
            proxyReq.setHeader("Authorization", `Basic ${auth}`);
            proxyReq.setHeader("Content-Type", "application/json");
          });
        },
      },
      "/api/recommend-outfit": {
        target: "https://nvmthoai3.app.n8n.cloud",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/recommend-outfit/, "/webhook/recommend-outfit"),
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, _req, _res) => {
            // Add Basic Auth header
            const auth = Buffer.from("botuser:supersecret").toString("base64");
            proxyReq.setHeader("Authorization", `Basic ${auth}`);
            proxyReq.setHeader("Content-Type", "application/json");
          });
        },
      },
      "/api/n8n": {
        target: "https://nvmthoai1.app.n8n.cloud",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api\/n8n/, "/webhook/fc1aa0bb-d14d-4ba3-859e-e69fc31a22c8"),
        configure: (proxy, _options) => {
          proxy.on("proxyReq", (proxyReq, _req, _res) => {
            // Add Basic Auth header if n8n requires it and ensure JSON content-type
            const auth = Buffer.from("botuser:supersecret").toString("base64");
            proxyReq.setHeader("Authorization", `Basic ${auth}`);
            proxyReq.setHeader("Content-Type", "application/json");
          });
          // Log upstream responses for easier debugging
          proxy.on("proxyRes", (proxyRes, req) => {
            try {
              // Log method/url and upstream status code. Avoid accessing proxyRes.req which isn't typed.
              // eslint-disable-next-line no-console
              console.debug(`[proxy] ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
            } catch (e) {
              // ignore logging errors
            }
          });
        },
      },
      "/api": {
        target: "http://103.163.24.150:3000",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\//, "/"),
      },
    },
  },
});
