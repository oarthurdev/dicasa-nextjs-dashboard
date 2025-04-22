// server/index.ts
import dotenv2 from "dotenv";
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/supabase.ts
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
var supabaseUrl = process.env.VITE_SUPABASE_URL || "";
var supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";
var supabase = createClient(supabaseUrl, supabaseAnonKey);
async function getBrokerRankings() {
  const { data, error } = await supabase.from("broker_points").select("*").order("pontos", { ascending: false });
  if (error) {
    console.error("Error fetching broker rankings:", error);
    throw error;
  }
  return data;
}
async function getBrokerById(id) {
  const { data, error } = await supabase.from("brokers").select("*").eq("id", id).single();
  if (error) {
    console.error(`Error fetching broker with ID ${id}:`, error);
    throw error;
  }
  return data;
}
async function getBrokerRankPosition(id) {
  try {
    const { data, error } = await supabase.from("broker_points").select("id").order("pontos", { ascending: false });
    if (error) throw error;
    const position = data.findIndex((broker) => broker.id === id) + 1;
    return position > 0 ? position : 1;
  } catch (error) {
    console.error(
      `Error finding rank position for broker with ID ${id}:`,
      error
    );
    return 1;
  }
}
async function getBrokerPoints(id) {
  const { data, error } = await supabase.from("broker_points").select("*").eq("id", id).single();
  if (error) {
    console.error(`Error fetching points for broker with ID ${id}:`, error);
    throw error;
  }
  return data;
}
async function getBrokerLeads(id) {
  const { data, error } = await supabase.from("leads").select("*").eq("responsavel_id", id).order("criado_em", { ascending: false });
  if (error) {
    console.error(`Error fetching leads for broker with ID ${id}:`, error);
    throw error;
  }
  return data;
}
async function getBrokerActivities(id) {
  const { data, error } = await supabase.from("activities").select("*").eq("user_id", id).order("criado_em", { ascending: false });
  if (error) {
    console.error(`Error fetching activities for broker with ID ${id}:`, error);
    throw error;
  }
  return data;
}
async function getActivityHeatmap(brokerId) {
  try {
    const { data, error } = await supabase.from("activities").select("dia_semana, hora").eq("user_id", brokerId).eq("tipo", "mensagem_enviada").gte("hora", 8).lte("hora", 22);
    if (error) {
      throw error;
    }
    const dias = [
      "Segunda",
      "Ter\xE7a",
      "Quarta",
      "Quinta",
      "Sexta",
      "S\xE1bado",
      "Domingo"
    ];
    const horarios = Array.from({ length: 15 }, (_, i) => `${i + 8}h`);
    const dados = Array(7).fill(0).map(() => Array(15).fill(0));
    if (data) {
      data.forEach((activity) => {
        const diaIndex = dias.indexOf(activity.dia_semana);
        const horaAjustada = activity.hora - 8;
        if (diaIndex >= 0 && horaAjustada >= 0 && horaAjustada < 15) {
          dados[diaIndex][horaAjustada]++;
        }
      });
    }
    return {
      dias,
      horarios,
      dados
    };
  } catch (error) {
    console.error(`Error generating heatmap for broker ${brokerId}:`, error);
    throw error;
  }
}
async function getBrokerAlerts(brokerId) {
  try {
    const brokerPoints = await getBrokerPoints(brokerId);
    if (!brokerPoints) {
      return [];
    }
    const alerts = [];
    if (brokerPoints.leads_sem_interacao_24h > 0) {
      alerts.push({
        tipo: "warning",
        mensagem: "Leads sem intera\xE7\xE3o h\xE1 mais de 24h",
        quantidade: brokerPoints.leads_sem_interacao_24h
      });
    }
    if (brokerPoints.leads_respondidos_apos_18h > 0) {
      alerts.push({
        tipo: "warning",
        mensagem: "Leads respondidos ap\xF3s 18h",
        quantidade: brokerPoints.leads_respondidos_apos_18h
      });
    }
    if (brokerPoints.leads_5_dias_sem_mudanca > 0) {
      alerts.push({
        tipo: "critical",
        mensagem: "Leads sem atualiza\xE7\xE3o h\xE1 mais de 5 dias",
        quantidade: brokerPoints.leads_5_dias_sem_mudanca
      });
    }
    return alerts;
  } catch (error) {
    console.error(`Error generating alerts for broker ${brokerId}:`, error);
    throw error;
  }
}
async function getBrokerPerformance(brokerId) {
  try {
    const activities = await getBrokerActivities(brokerId);
    const leads = await getBrokerLeads(brokerId);
    const monthlyData = generateMonthlyData(activities, leads);
    const propertyTypes = calculatePropertyTypes(leads);
    return {
      monthlyData,
      propertyTypes
    };
  } catch (error) {
    console.error(
      `Error generating performance data for broker ${brokerId}:`,
      error
    );
    throw error;
  }
}
async function getTotalLeads() {
  try {
    const { data, error } = await supabase.from("leads").select("id");
    if (error) throw error;
    return data?.length || 0;
  } catch (error) {
    console.error("Error fetching total leads:", error);
    return 0;
  }
}
async function getActiveBrokers() {
  try {
    const { data, error } = await supabase.from("brokers").select("id").eq("cargo", "Corretor");
    if (error) throw error;
    return data?.length || 0;
  } catch (error) {
    console.error("Error fetching active brokers:", error);
    return 0;
  }
}
async function getAveragePoints() {
  try {
    const { data, error } = await supabase.from("broker_points").select("pontos");
    if (error) throw error;
    if (!data || data.length === 0) return 0;
    const total = data.reduce((sum, broker) => sum + (broker.pontos || 0), 0);
    return Math.round(total / data.length);
  } catch (error) {
    console.error("Error calculating average points:", error);
    return 0;
  }
}
async function getTotalSales() {
  try {
    const { data, error } = await supabase.from("broker_points").select("vendas_realizadas");
    if (error) throw error;
    if (!data) return 0;
    return data.reduce(
      (sum, broker) => sum + (broker.vendas_realizadas || 0),
      0
    );
  } catch (error) {
    console.error("Error calculating total sales:", error);
    return 0;
  }
}
async function getDashboardMetrics() {
  try {
    const [totalLeads, activeBrokers, averagePoints, totalSales] = await Promise.all([
      getTotalLeads(),
      getActiveBrokers(),
      getAveragePoints(),
      getTotalSales()
    ]);
    return {
      totalLeads,
      activeBrokers,
      averagePoints,
      totalSales
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return {
      totalLeads: 0,
      activeBrokers: 0,
      averagePoints: 0,
      totalSales: 0
    };
  }
}
function generateMonthlyData(_activities, _leads) {
  return [
    { month: "Jan", salesAmount: 45e4, propertiesSold: 2, points: 45 },
    { month: "Fev", salesAmount: 32e4, propertiesSold: 1, points: 30 },
    { month: "Mar", salesAmount: 78e4, propertiesSold: 3, points: 72 },
    { month: "Abr", salesAmount: 55e4, propertiesSold: 2, points: 53 },
    { month: "Mai", salesAmount: 63e4, propertiesSold: 2, points: 48 },
    { month: "Jun", salesAmount: 92e4, propertiesSold: 4, points: 85 }
  ];
}
function calculatePropertyTypes(_leads) {
  return [
    { type: "Apartamento", percentage: 45, count: 9 },
    { type: "Casa", percentage: 30, count: 6 },
    { type: "Terreno", percentage: 15, count: 3 },
    { type: "Comercial", percentage: 10, count: 2 }
  ];
}

// server/routes.ts
async function registerRoutes(app2) {
  app2.get("/api/brokers/rankings", async (req, res) => {
    try {
      const brokers = await getBrokerRankings();
      res.json(brokers);
    } catch (error) {
      console.error("Erro ao buscar ranking de corretores:", error);
      res.status(500).json({ message: "Falha ao buscar ranking de corretores" });
    }
  });
  app2.get("/api/brokers/:id", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const broker = await getBrokerById(brokerId);
      if (!broker) {
        return res.status(404).json({ message: "Corretor n\xE3o encontrado" });
      }
      res.json(broker);
    } catch (error) {
      console.error("Erro ao buscar corretor:", error);
      res.status(500).json({ message: "Falha ao buscar detalhes do corretor" });
    }
  });
  app2.get("/api/brokers/:id/rank-position", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const position = await getBrokerRankPosition(brokerId);
      res.json({ position });
    } catch (error) {
      console.error("Erro ao buscar posi\xE7\xE3o no ranking:", error);
      res.status(500).json({ message: "Falha ao buscar posi\xE7\xE3o no ranking" });
    }
  });
  app2.get("/api/brokers/:id/points", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const brokerPoints = await getBrokerPoints(brokerId);
      if (!brokerPoints) {
        return res.status(404).json({ message: "Pontua\xE7\xE3o do corretor n\xE3o encontrada" });
      }
      res.json(brokerPoints);
    } catch (error) {
      console.error("Erro ao buscar pontua\xE7\xE3o do corretor:", error);
      res.status(500).json({ message: "Falha ao buscar pontua\xE7\xE3o do corretor" });
    }
  });
  app2.get("/api/brokers/:id/leads", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const leads = await getBrokerLeads(brokerId);
      res.json(leads);
    } catch (error) {
      console.error("Erro ao buscar leads do corretor:", error);
      res.status(500).json({ message: "Falha ao buscar leads do corretor" });
    }
  });
  app2.get("/api/brokers/:id/activities", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const activities = await getBrokerActivities(brokerId);
      res.json(activities);
    } catch (error) {
      console.error("Erro ao buscar atividades do corretor:", error);
      res.status(500).json({ message: "Falha ao buscar atividades do corretor" });
    }
  });
  app2.get("/api/brokers/:id/performance", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const performance = await getBrokerPerformance(brokerId);
      res.json(performance);
    } catch (error) {
      console.error("Erro ao buscar performance do corretor:", error);
      res.status(500).json({ message: "Falha ao buscar dados de performance do corretor" });
    }
  });
  app2.get("/api/brokers/:id/heatmap", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const heatmap = await getActivityHeatmap(brokerId);
      res.json(heatmap);
    } catch (error) {
      console.error("Erro ao buscar heatmap do corretor:", error);
      res.status(500).json({ message: "Falha ao buscar mapa de calor de atividades" });
    }
  });
  app2.get("/api/brokers/:id/alerts", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const alerts = await getBrokerAlerts(brokerId);
      res.json(alerts);
    } catch (error) {
      console.error("Erro ao buscar alertas do corretor:", error);
      res.status(500).json({ message: "Falha ao buscar alertas do corretor" });
    }
  });
  app2.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Erro ao buscar m\xE9tricas do dashboard:", error);
      res.status(500).json({ message: "Falha ao buscar m\xE9tricas do dashboard" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, "client"),
  server: {
    host: "0.0.0.0",
    port: 5173
    // ou qualquer outra porta que preferir
  },
  build: {
    outDir: "../server/public",
    // saída para a raiz do projeto
    emptyOutDir: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
import { fileURLToPath as fileURLToPath2 } from "url";
import path2 from "path";
var viteLogger = createLogger();
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: []
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "public",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname);
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
dotenv2.config();
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
