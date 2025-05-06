import type { Express } from "express";
import { createServer, type Server } from "http";
import * as supabaseServer from "./supabase";

export async function registerRoutes(app: Express): Promise<Server> {
  // Rota para obter o ranking de corretores (pontos)
  app.get("/api/brokers/rankings", async (req, res) => {
    try {
      const brokers = await supabaseServer.getBrokerRankings();
      res.json(brokers);
    } catch (error) {
      console.error("Erro ao buscar ranking de corretores:", error);
      res
        .status(500)
        .json({ message: "Falha ao buscar ranking de corretores" });
    }
  });

  // Rota para obter detalhes de um corretor específico
  app.get("/api/brokers/:id", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const broker = await supabaseServer.getBrokerById(brokerId);

      if (!broker || !broker.active) {
        return res.status(403).json({ message: "Corretor inativo ou não encontrado" });
      }

      res.json(broker);
    } catch (error) {
      console.error("Erro ao buscar corretor:", error);
      res.status(500).json({ message: "Falha ao buscar detalhes do corretor" });
    }
  });

  // Rota para obter a posição no ranking
  app.get("/api/brokers/:id/rank-position", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const position = await supabaseServer.getBrokerRankPosition(brokerId);
      res.json({ position });
    } catch (error) {
      console.error("Erro ao buscar posição no ranking:", error);
      res.status(500).json({ message: "Falha ao buscar posição no ranking" });
    }
  });

  // Rota para obter pontuação de um corretor
  app.get("/api/brokers/:id/points", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const brokerPoints = await supabaseServer.getBrokerPoints(brokerId);

      if (!brokerPoints) {
        return res
          .status(404)
          .json({ message: "Pontuação do corretor não encontrada" });
      }

      res.json(brokerPoints);
    } catch (error) {
      console.error("Erro ao buscar pontuação do corretor:", error);
      res
        .status(500)
        .json({ message: "Falha ao buscar pontuação do corretor" });
    }
  });

  // Rota para obter leads de um corretor
  app.get("/api/brokers/:id/leads", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const leads = await supabaseServer.getBrokerLeads(brokerId);

      res.json(leads);
    } catch (error) {
      console.error("Erro ao buscar leads do corretor:", error);
      res.status(500).json({ message: "Falha ao buscar leads do corretor" });
    }
  });

  // Rota para obter atividades de um corretor
  app.get("/api/brokers/:id/activities", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const activities = await supabaseServer.getBrokerActivities(brokerId);

      res.json(activities);
    } catch (error) {
      console.error("Erro ao buscar atividades do corretor:", error);
      res
        .status(500)
        .json({ message: "Falha ao buscar atividades do corretor" });
    }
  });

  // Rota para obter performance de um corretor
  app.get("/api/brokers/:id/performance", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const performance = await supabaseServer.getBrokerPerformance(brokerId);

      res.json(performance);
    } catch (error) {
      console.error("Erro ao buscar performance do corretor:", error);
      res
        .status(500)
        .json({ message: "Falha ao buscar dados de performance do corretor" });
    }
  });

  // Rota para obter heatmap de atividades de um corretor
  app.get("/api/brokers/:id/heatmap", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const heatmap = await supabaseServer.getActivityHeatmap(brokerId);

      res.json(heatmap);
    } catch (error) {
      console.error("Erro ao buscar heatmap do corretor:", error);
      res
        .status(500)
        .json({ message: "Falha ao buscar mapa de calor de atividades" });
    }
  });

  // Rota para obter alertas de um corretor
  app.get("/api/brokers/:id/alerts", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const alerts = await supabaseServer.getBrokerAlerts(brokerId);

      res.json(alerts);
    } catch (error) {
      console.error("Erro ao buscar alertas do corretor:", error);
      res.status(500).json({ message: "Falha ao buscar alertas do corretor" });
    }
  });
  
  // Rota para obter métricas do dashboard
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const metrics = await supabaseServer.getDashboardMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Erro ao buscar métricas do dashboard:", error);
      res.status(500).json({ message: "Falha ao buscar métricas do dashboard" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
