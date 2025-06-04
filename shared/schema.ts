import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const players = pgTable("players", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  name: text("name").notNull().default("Adventurer"),
  level: integer("level").notNull().default(1),
  health: integer("health").notNull().default(100),
  maxHealth: integer("max_health").notNull().default(100),
  energy: integer("energy").notNull().default(100),
  maxEnergy: integer("max_energy").notNull().default(100),
  gold: integer("gold").notNull().default(0),
  currentStoryId: text("current_story_id").notNull().default("temple_entrance"),
  inventory: jsonb("inventory").$type<string[]>().notNull().default([]),
  completedChoices: jsonb("completed_choices").$type<string[]>().notNull().default([]),
  questProgress: jsonb("quest_progress").$type<Record<string, number>>().notNull().default({}),
});

export const stories = pgTable("stories", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  chapter: text("chapter").notNull(),
  content: jsonb("content").$type<string[]>().notNull(),
  imageUrl: text("image_url"),
  choices: jsonb("choices").$type<Choice[]>().notNull(),
});

export const gameChoices = pgTable("game_choices", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  storyId: text("story_id").notNull(),
  choiceId: text("choice_id").notNull(),
  timestamp: integer("timestamp").notNull(),
});

// Zod schemas for validation
export const choiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  requirement: z.string().optional(),
  risk: z.enum(["low", "moderate", "high", "info"]).optional(),
  nextStoryId: z.string(),
  effects: z.object({
    health: z.number().optional(),
    energy: z.number().optional(),
    gold: z.number().optional(),
    addItems: z.array(z.string()).optional(),
    removeItems: z.array(z.string()).optional(),
    questProgress: z.record(z.number()).optional(),
  }).optional(),
});

export const storySchema = z.object({
  id: z.string(),
  title: z.string(),
  chapter: z.string(),
  content: z.array(z.string()),
  imageUrl: z.string().optional(),
  choices: z.array(choiceSchema),
});

export const insertPlayerSchema = createInsertSchema(players).omit({
  id: true,
});

export const updatePlayerSchema = insertPlayerSchema.partial();

export const makeChoiceSchema = z.object({
  sessionId: z.string(),
  storyId: z.string(),
  choiceId: z.string(),
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type UpdatePlayer = z.infer<typeof updatePlayerSchema>;
export type Story = typeof stories.$inferSelect;
export type Choice = z.infer<typeof choiceSchema>;
export type MakeChoice = z.infer<typeof makeChoiceSchema>;
