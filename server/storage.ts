import { players, gameChoices, type Player, type InsertPlayer, type UpdatePlayer, type GameChoice, type InsertChoice } from "../shared/schema.js";
import { db } from "./db.js";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Player management
  getPlayer(sessionId: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(sessionId: string, updates: UpdatePlayer): Promise<Player | undefined>;
  
  // Choice tracking
  saveChoice(choice: InsertChoice): Promise<void>;
  getPlayerChoices(sessionId: string): Promise<GameChoice[]>;
}

export class DatabaseStorage implements IStorage {
  async getPlayer(sessionId: string): Promise<Player | undefined> {
    const [player] = await db.select().from(players).where(eq(players.sessionId, sessionId));
    return player || undefined;
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const [player] = await db
      .insert(players)
      .values({
        ...insertPlayer,
        updatedAt: new Date()
      })
      .returning();
    return player;
  }

  async updatePlayer(sessionId: string, updates: UpdatePlayer): Promise<Player | undefined> {
    const [player] = await db
      .update(players)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(players.sessionId, sessionId))
      .returning();
    return player || undefined;
  }

  async saveChoice(choice: InsertChoice): Promise<void> {
    await db.insert(gameChoices).values(choice);
  }

  async getPlayerChoices(sessionId: string): Promise<GameChoice[]> {
    return await db.select().from(gameChoices).where(eq(gameChoices.sessionId, sessionId));
  }
}

export const storage = new DatabaseStorage();