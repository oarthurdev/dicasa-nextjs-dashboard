import express, { type Express } from "express";
import fs from "fs";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config.js";
import { nanoid } from "nanoid";

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Função para configurar o Vite no modo dev
export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: false,
    hmr: { server },
    allowedHosts: [],
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);

  // Captura requests com base dinâmica (UUID)
  app.use("/:uuid/*", async (req, res, next) => {
    const url = req.originalUrl;
    const distDir = path.resolve(__dirname, "..", "dist");

    try {
      const clientTemplate = path.resolve(distDir, "index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");

      // Corrige o caminho para o script principal, adicionando um hash para forçar reload em dev
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

// Função para servir arquivos estáticos em produção
export function serveStatic(app: Express) {
  const distDir = path.resolve(__dirname, "..", "dist");

  // Serve os arquivos estáticos normalmente
  app.use(express.static(distDir));

  // Serve a SPA para qualquer rota /:uuid/*
  app.get("/:uuid/*", (req, res) => {
    res.sendFile(path.resolve(distDir, "index.html"));
  });
}
