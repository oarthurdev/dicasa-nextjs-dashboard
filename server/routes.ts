import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Rota para obter o ranking de corretores (pontos)
  app.get("/api/brokers/rankings", async (req, res) => {
    try {
      const brokers = await storage.getBrokerRankings();
      res.json(brokers);
    } catch (error) {
      console.error("Erro ao buscar ranking de corretores:", error);
      res.status(500).json({ message: "Falha ao buscar ranking de corretores" });
    }
  });

  // Rota para obter detalhes de um corretor específico
  app.get("/api/brokers/:id", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const broker = await storage.getBrokerById(brokerId);
      
      if (!broker) {
        return res.status(404).json({ message: "Corretor não encontrado" });
      }
      
      res.json(broker);
    } catch (error) {
      console.error("Erro ao buscar corretor:", error);
      res.status(500).json({ message: "Falha ao buscar detalhes do corretor" });
    }
  });

  // Rota para obter pontuação de um corretor
  app.get("/api/brokers/:id/points", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const brokerPoints = await storage.getBrokerPoints(brokerId);
      
      if (!brokerPoints) {
        return res.status(404).json({ message: "Pontuação do corretor não encontrada" });
      }
      
      res.json(brokerPoints);
    } catch (error) {
      console.error("Erro ao buscar pontuação do corretor:", error);
      res.status(500).json({ message: "Falha ao buscar pontuação do corretor" });
    }
  });

  // Rota para obter leads de um corretor
  app.get("/api/brokers/:id/leads", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const leads = await storage.getBrokerLeads(brokerId);
      
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
      const activities = await storage.getBrokerActivities(brokerId);
      
      res.json(activities);
    } catch (error) {
      console.error("Erro ao buscar atividades do corretor:", error);
      res.status(500).json({ message: "Falha ao buscar atividades do corretor" });
    }
  });

  // Rota para obter performance de um corretor
  app.get("/api/brokers/:id/performance", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const performance = await storage.getBrokerPerformance(brokerId);
      
      res.json(performance);
    } catch (error) {
      console.error("Erro ao buscar performance do corretor:", error);
      res.status(500).json({ message: "Falha ao buscar dados de performance do corretor" });
    }
  });

  // Rota para obter heatmap de atividades de um corretor
  app.get("/api/brokers/:id/heatmap", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const heatmap = await storage.getActivityHeatmap(brokerId);
      
      res.json(heatmap);
    } catch (error) {
      console.error("Erro ao buscar heatmap do corretor:", error);
      res.status(500).json({ message: "Falha ao buscar mapa de calor de atividades" });
    }
  });

  // Rota para obter alertas de um corretor
  app.get("/api/brokers/:id/alerts", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const alerts = await storage.getBrokerAlerts(brokerId);
      
      res.json(alerts);
    } catch (error) {
      console.error("Erro ao buscar alertas do corretor:", error);
      res.status(500).json({ message: "Falha ao buscar alertas do corretor" });
    }
  });

  // Rota para obter configuração da API Kommo
  app.get("/api/config/kommo", async (req, res) => {
    try {
      const config = await storage.getKommoConfig();
      
      if (!config) {
        return res.status(404).json({ message: "Configuração da API Kommo não encontrada" });
      }
      
      // Não retornar o token de acesso por segurança
      const { access_token, refresh_token, ...safeConfig } = config;
      
      res.json({
        ...safeConfig,
        has_access_token: !!access_token,
        has_refresh_token: !!refresh_token
      });
    } catch (error) {
      console.error("Erro ao buscar configuração da API Kommo:", error);
      res.status(500).json({ message: "Falha ao buscar configuração da API Kommo" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
