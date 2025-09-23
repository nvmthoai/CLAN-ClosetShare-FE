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
      '/api': {
        target: 'http://103.163.24.150:3000',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\//, '/'),
      },
    },
  },
});
