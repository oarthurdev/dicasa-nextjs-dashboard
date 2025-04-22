import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get dashboard stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Get broker rankings
  app.get("/api/brokers/rankings", async (req, res) => {
    try {
      const brokers = await storage.getBrokerRankings();
      res.json(brokers);
    } catch (error) {
      console.error("Error fetching broker rankings:", error);
      res.status(500).json({ message: "Failed to fetch broker rankings" });
    }
  });

  // Get broker details by ID
  app.get("/api/brokers/:id", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const broker = await storage.getBrokerById(brokerId);
      
      if (!broker) {
        return res.status(404).json({ message: "Broker not found" });
      }
      
      res.json(broker);
    } catch (error) {
      console.error("Error fetching broker:", error);
      res.status(500).json({ message: "Failed to fetch broker details" });
    }
  });

  // Get broker performance data
  app.get("/api/brokers/:id/performance", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const performance = await storage.getBrokerPerformance(brokerId);
      
      if (!performance) {
        return res.status(404).json({ message: "Broker performance data not found" });
      }
      
      res.json(performance);
    } catch (error) {
      console.error("Error fetching broker performance:", error);
      res.status(500).json({ message: "Failed to fetch broker performance data" });
    }
  });

  // Get broker recent sales
  app.get("/api/brokers/:id/sales", async (req, res) => {
    try {
      const brokerId = parseInt(req.params.id);
      const sales = await storage.getBrokerRecentSales(brokerId);
      
      res.json(sales);
    } catch (error) {
      console.error("Error fetching broker sales:", error);
      res.status(500).json({ message: "Failed to fetch broker sales data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
