import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { makeChoiceSchema, updatePlayerSchema } from "@shared/schema";
import { z } from "zod";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get or create player
  app.post("/api/player", async (req, res) => {
    try {
      const sessionId = req.body.sessionId || nanoid();
      
      let player = await storage.getPlayer(sessionId);
      
      if (!player) {
        player = await storage.createPlayer({
          sessionId,
          name: "Adventurer",
          level: 1,
          health: 85,
          maxHealth: 100,
          energy: 60,
          maxEnergy: 100,
          gold: 247,
          currentStoryId: "temple_entrance",
          inventory: ["sword", "health_potion", "scroll"],
          completedChoices: [],
          questProgress: {
            "ancient_temple": 30,
            "lost_artifact": 0
          }
        });
      }
      
      res.json(player);
    } catch (error) {
      res.status(500).json({ message: "Failed to get or create player" });
    }
  });

  // Get player by session ID
  app.get("/api/player/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const player = await storage.getPlayer(sessionId);
      
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.json(player);
    } catch (error) {
      res.status(500).json({ message: "Failed to get player" });
    }
  });

  // Update player
  app.patch("/api/player/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const updates = updatePlayerSchema.parse(req.body);
      
      const player = await storage.updatePlayer(sessionId, updates);
      
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      res.json(player);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid player data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update player" });
    }
  });

  // Get story by ID
  app.get("/api/story/:storyId", async (req, res) => {
    try {
      const { storyId } = req.params;
      const story = await storage.getStory(storyId);
      
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to get story" });
    }
  });

  // Get all stories
  app.get("/api/stories", async (req, res) => {
    try {
      const stories = await storage.getAllStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stories" });
    }
  });

  // Make a choice
  app.post("/api/choice", async (req, res) => {
    try {
      const choice = makeChoiceSchema.parse(req.body);
      
      // Record the choice
      await storage.makeChoice(choice);
      
      // Get the current story to find the choice effects
      const story = await storage.getStory(choice.storyId);
      if (!story) {
        return res.status(404).json({ message: "Story not found" });
      }
      
      const selectedChoice = story.choices.find(c => c.id === choice.choiceId);
      if (!selectedChoice) {
        return res.status(404).json({ message: "Choice not found" });
      }
      
      // Get current player
      const player = await storage.getPlayer(choice.sessionId);
      if (!player) {
        return res.status(404).json({ message: "Player not found" });
      }
      
      // Apply choice effects
      const updates: any = {
        currentStoryId: selectedChoice.nextStoryId,
        completedChoices: [...player.completedChoices, choice.choiceId]
      };
      
      if (selectedChoice.effects) {
        const effects = selectedChoice.effects;
        
        if (effects.health !== undefined) {
          updates.health = Math.max(0, Math.min(player.maxHealth, player.health + effects.health));
        }
        
        if (effects.energy !== undefined) {
          updates.energy = Math.max(0, Math.min(player.maxEnergy, player.energy + effects.energy));
        }
        
        if (effects.gold !== undefined) {
          updates.gold = Math.max(0, player.gold + effects.gold);
        }
        
        if (effects.addItems) {
          updates.inventory = [...player.inventory, ...effects.addItems];
        }
        
        if (effects.removeItems) {
          updates.inventory = player.inventory.filter(item => !effects.removeItems!.includes(item));
        }
        
        if (effects.questProgress) {
          updates.questProgress = { ...player.questProgress };
          Object.entries(effects.questProgress).forEach(([questId, progress]) => {
            updates.questProgress[questId] = Math.max(
              updates.questProgress[questId] || 0, 
              progress
            );
          });
        }
      }
      
      // Update player with effects
      const updatedPlayer = await storage.updatePlayer(choice.sessionId, updates);
      
      // Get the next story
      const nextStory = await storage.getStory(selectedChoice.nextStoryId);
      
      res.json({
        player: updatedPlayer,
        nextStory,
        choice: selectedChoice
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid choice data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to process choice" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
