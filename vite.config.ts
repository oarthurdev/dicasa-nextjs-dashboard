import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "client"),
  server: {
    host: "0.0.0.0",
    port: 5173, // ou qualquer outra porta que preferir
  },
  build: {
    outDir: "./server/public", // saída para a raiz do projeto
    emptyOutDir: true,
  },
  resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
    },
  }
});
