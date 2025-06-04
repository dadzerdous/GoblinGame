import { pgTable, text, integer, jsonb, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  playerName: text("player_name"),
  currentScene: text("current_scene").default("start"),
  xp: integer("xp").default(0),
  inventory: jsonb("inventory").default([]),
  equipment: jsonb("equipment").default({}),
  gameState: jsonb("game_state").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const gameChoices = pgTable("game_choices", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  scene: text("scene").notNull(),
  choice: text("choice").notNull(),
  timestamp: timestamp("timestamp").defaultNow()
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const updatePlayerSchema = insertPlayerSchema.partial();

export const insertChoiceSchema = createInsertSchema(gameChoices).omit({
  id: true,
  timestamp: true
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type UpdatePlayer = z.infer<typeof updatePlayerSchema>;
export type GameChoice = typeof gameChoices.$inferSelect;
export type InsertChoice = z.infer<typeof insertChoiceSchema>;