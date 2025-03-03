import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { getWeather } from "./weather";
import { getCropRecommendations } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/crops", async (_req, res) => {
    const crops = await storage.getCrops();
    res.json(crops);
  });

  app.get("/api/weather", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const weather = await getWeather(req.user.location);
      res.json(weather);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch weather data" });
    }
  });

  app.get("/api/recommendations", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const weather = await getWeather(req.user.location);
      const crops = await storage.getCrops();
      const recommendations = await getCropRecommendations(req.user, weather, crops);
      
      for (const rec of recommendations) {
        await storage.createRecommendation({
          userId: req.user.id,
          ...rec,
        });
      }
      
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
