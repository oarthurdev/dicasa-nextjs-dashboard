import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    root: path.resolve(__dirname, "client"),
    server: {
      host: "0.0.0.0",
      port: 5173, // ou qualquer outra porta que preferir
    },
    build: {
      outDir: "../dist", // saída para a raiz do projeto
      emptyOutDir: true,
    },
    base: `/${process.env.VITE_COMPANY_ID || ''}/`,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
      define: {
        "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(
          env.VITE_SUPABASE_URL,
        ),
        "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(
          env.VITE_SUPABASE_ANON_KEY,
        ),
        "import.meta.env.VITE_API_URL": JSON.stringify(env.VITE_API_URL),
      },
    },
  };
});
