import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "#": path.resolve(__dirname, "."),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_PROXY,
          changeOrigin: true,
          cookieDomainRewrite: "localhost",
          ws: true,
        },
      },
      port: 5000,
      host: true
    },
  };
});
