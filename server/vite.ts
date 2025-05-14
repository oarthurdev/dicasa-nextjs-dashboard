import express, { type Express } from "express";
import fs from "fs";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config.js";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Função de log
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

// Função para configurar o Vite no Express
export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: false,
    hmr: { server },
    allowedHosts: []
  };

  // Criando o servidor Vite
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

  // Adicionando o middleware do Vite
  app.use(vite.middlewares);

  // Middleware para capturar o companyId da URL
  app.use("/:companyId", async (req, res, next) => {
    const { companyId } = req.params;
    
    console.log(companyId)
    if (!companyId) {
      return res.status(400).json({ error: "Company ID is required" });
    }

    // Configurar variável de ambiente para Vite
    process.env.VITE_COMPANY_ID = companyId;

    next();
  });

  // Roteamento da requisição para o index.html com a aplicação frontend
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    const distDir = path.resolve(__dirname, '..', 'dist');
    try {
      const clientTemplate = path.resolve(distDir, 'index.html');

      // Sempre recarrega o index.html do disco caso mude
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
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

// Função para servir arquivos estáticos
export function serveStatic(app: Express) {
  const distDir = path.resolve(__dirname, '..', 'dist'); // Caminho correto para a pasta 'dist'

  // Serve os arquivos estáticos
  app.use(express.static(distDir));

  // Roteia todas as outras requisições para o arquivo 'index.html' de produção
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distDir, 'index.html'));
  });
}

