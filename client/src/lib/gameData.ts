// This file contains game constants and helper functions

export const INITIAL_PLAYER_STATS = {
  health: 85,
  maxHealth: 100,
  energy: 60,
  maxEnergy: 100,
  gold: 247,
  level: 1,
};

export const INITIAL_INVENTORY = ["sword", "health_potion", "scroll"];

export const INITIAL_QUEST_PROGRESS = {
  ancient_temple: 30,
  lost_artifact: 0,
};

export const ITEM_NAMES: Record<string, string> = {
  sword: "Iron Sword",
  health_potion: "Health Potion",
  scroll: "Ancient Scroll",
  ancient_knowledge: "Ancient Knowledge",
  ancient_scroll: "Mystical Scroll",
  wisdom_tome: "Tome of Wisdom",
  golden_amulet: "Golden Amulet",
  mystical_crystal: "Mystical Crystal",
  protective_ward: "Protective Ward",
  temple_map: "Temple Map",
  healing_potion: "Healing Potion",
  torch: "Burning Torch",
};

export const QUEST_NAMES: Record<string, string> = {
  ancient_temple: "The Ancient Temple",
  lost_artifact: "The Lost Artifact",
};

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatItemName(itemId: string): string {
  return ITEM_NAMES[itemId] || itemId.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}

export function formatQuestName(questId: string): string {
  return QUEST_NAMES[questId] || questId.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
}
