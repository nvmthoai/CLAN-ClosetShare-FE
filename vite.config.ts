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
      "/api": {
        target: "http://103.163.24.150:3000",
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\//, "/"),
      },
    },
  },
});
