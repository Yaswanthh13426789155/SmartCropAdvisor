import { pgTable, text, serial, integer, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  landSize: integer("land_size").notNull(),
  preferredLanguage: text("preferred_language").notNull().default("en"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crops = pgTable("crops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameHi: text("name_hi").notNull(),
  idealConditions: json("ideal_conditions").notNull(),
  seasonality: text("seasonality").notNull(),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cropId: integer("crop_id").notNull(),
  confidence: integer("confidence").notNull(),
  notes: text("notes").notNull(),
  notesHi: text("notes_hi").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  location: true,
  landSize: true,
  preferredLanguage: true,
});

export const insertCropSchema = createInsertSchema(crops);
export const insertRecommendationSchema = createInsertSchema(recommendations);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Crop = typeof crops.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
