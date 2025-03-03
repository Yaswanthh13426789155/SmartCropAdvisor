import { InsertUser, User, Crop, Recommendation } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCrops(): Promise<Crop[]>;
  getRecommendationsForUser(userId: number): Promise<Recommendation[]>;
  createRecommendation(recommendation: Omit<Recommendation, "id" | "createdAt">): Promise<Recommendation>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private crops: Map<number, Crop>;
  private recommendations: Map<number, Recommendation>;
  private currentId: number;
  sessionStore: session.SessionStore;

  constructor() {
    this.users = new Map();
    this.crops = new Map();
    this.recommendations = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    
    // Seed some initial crops
    this.seedCrops();
  }

  private seedCrops() {
    const crops: Omit<Crop, "id">[] = [
      {
        name: "Rice",
        nameHi: "चावल",
        seasonality: "Kharif",
        idealConditions: {
          temperature: { min: 20, max: 35 },
          humidity: { min: 60, max: 90 },
          rainfall: { min: 100, max: 200 },
        },
      },
      {
        name: "Wheat",
        nameHi: "गेहूं",
        seasonality: "Rabi",
        idealConditions: {
          temperature: { min: 15, max: 25 },
          humidity: { min: 50, max: 70 },
          rainfall: { min: 50, max: 100 },
        },
      },
    ];

    crops.forEach((crop) => {
      const id = this.currentId++;
      this.crops.set(id, { ...crop, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async getCrops(): Promise<Crop[]> {
    return Array.from(this.crops.values());
  }

  async getRecommendationsForUser(userId: number): Promise<Recommendation[]> {
    return Array.from(this.recommendations.values()).filter(
      (rec) => rec.userId === userId,
    );
  }

  async createRecommendation(
    recommendation: Omit<Recommendation, "id" | "createdAt">,
  ): Promise<Recommendation> {
    const id = this.currentId++;
    const fullRecommendation: Recommendation = {
      ...recommendation,
      id,
      createdAt: new Date(),
    };
    this.recommendations.set(id, fullRecommendation);
    return fullRecommendation;
  }
}

export const storage = new MemStorage();
