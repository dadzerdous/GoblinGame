import { 
  players, 
  stories, 
  gameChoices,
  type Player, 
  type InsertPlayer, 
  type UpdatePlayer,
  type Story,
  type MakeChoice,
  type Choice
} from "@shared/schema";

export interface IStorage {
  // Player management
  getPlayer(sessionId: string): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayer(sessionId: string, updates: UpdatePlayer): Promise<Player | undefined>;
  
  // Story management
  getStory(storyId: string): Promise<Story | undefined>;
  getAllStories(): Promise<Story[]>;
  
  // Choice tracking
  makeChoice(choice: MakeChoice): Promise<void>;
  getPlayerChoices(sessionId: string): Promise<string[]>;
}

export class MemStorage implements IStorage {
  private players: Map<string, Player>;
  private stories: Map<string, Story>;
  private choices: Map<string, MakeChoice[]>;
  private currentId: number;

  constructor() {
    this.players = new Map();
    this.stories = new Map();
    this.choices = new Map();
    this.currentId = 1;
    this.initializeStories();
  }

  private initializeStories() {
    const initialStories: Story[] = [
      {
        id: "temple_entrance",
        title: "The Forbidden Entrance",
        chapter: "Chapter 1",
        content: [
          "The ancient temple looms before you, its weathered stone columns reaching toward the darkening sky. Mysterious runes carved deep into the archway pulse with a faint, otherworldly light. The air around you feels thick with magic and danger.",
          "Your leather boots crunch softly on the fallen leaves as you approach the entrance. The stories you've heard in the taverns speak of untold treasures hidden within, but also of the many adventurers who entered and never returned.",
          "As you stand at the threshold, you notice three possible paths forward. Each choice will determine your fate..."
        ],
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
        choices: [
          {
            id: "main_entrance",
            text: "Enter through the main archway",
            requirement: "Combat Skill",
            risk: "moderate",
            nextStoryId: "temple_hall",
            effects: {
              health: -10,
              questProgress: { "ancient_temple": 50 }
            }
          },
          {
            id: "side_entrance",
            text: "Search for a hidden side entrance",
            requirement: "Stealth Skill",
            risk: "low",
            nextStoryId: "hidden_passage",
            effects: {
              energy: -5,
              questProgress: { "ancient_temple": 40 }
            }
          },
          {
            id: "study_runes",
            text: "Study the magical runes first",
            requirement: "Magic Knowledge",
            risk: "info",
            nextStoryId: "rune_discovery",
            effects: {
              energy: -15,
              addItems: ["ancient_knowledge"],
              questProgress: { "ancient_temple": 35 }
            }
          }
        ]
      },
      {
        id: "temple_hall",
        title: "The Great Hall",
        chapter: "Chapter 2",
        content: [
          "You stride confidently through the main archway, your hand resting on your sword hilt. The ancient stones seem to whisper warnings as you pass beneath them.",
          "Inside, the temple reveals its secrets: a vast hall with soaring ceilings disappears into shadows above. Pillars carved with more mystical runes support the ancient structure, and in the center of the hall, a mysterious altar glows with inner light.",
          "Suddenly, you hear the sound of stone grinding against stone. Ancient guardians are awakening to your presence..."
        ],
        imageUrl: "https://images.unsplash.com/photo-1544306094-e2dcf9479da3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
        choices: [
          {
            id: "fight_guardians",
            text: "Stand and fight the stone guardians",
            requirement: "Combat Skill",
            risk: "high",
            nextStoryId: "guardian_battle",
            effects: {
              health: -25,
              gold: 100,
              questProgress: { "ancient_temple": 75 }
            }
          },
          {
            id: "examine_altar",
            text: "Quickly examine the altar",
            requirement: "Magic Knowledge",
            risk: "moderate",
            nextStoryId: "altar_mystery",
            effects: {
              energy: -10,
              addItems: ["mystical_crystal"],
              questProgress: { "ancient_temple": 60 }
            }
          },
          {
            id: "retreat_entrance",
            text: "Retreat back to the entrance",
            requirement: "Stealth Skill",
            risk: "low",
            nextStoryId: "temple_entrance",
            effects: {
              energy: -5
            }
          }
        ]
      },
      {
        id: "hidden_passage",
        title: "The Secret Path",
        chapter: "Chapter 2",
        content: [
          "Your keen eyes spot a narrow crack in the temple's side wall, partially hidden by overgrown vines. You carefully push aside the vegetation and discover a secret entrance.",
          "The passage is narrow and dark, but your stealth training serves you well. You move silently through the shadows, avoiding the main corridors where danger surely lurks.",
          "The hidden path leads you to an underground chamber filled with ancient artifacts and scrolls. This appears to be a forgotten library of sorts..."
        ],
        imageUrl: "https://images.unsplash.com/photo-1551858538-8b3e8bb49e98?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
        choices: [
          {
            id: "study_scrolls",
            text: "Study the ancient scrolls",
            requirement: "Magic Knowledge",
            risk: "info",
            nextStoryId: "ancient_knowledge",
            effects: {
              energy: -10,
              addItems: ["ancient_scroll", "wisdom_tome"],
              questProgress: { "ancient_temple": 65, "lost_artifact": 25 }
            }
          },
          {
            id: "search_artifacts",
            text: "Search through the artifacts",
            requirement: "Investigation",
            risk: "moderate",
            nextStoryId: "treasure_chamber",
            effects: {
              energy: -15,
              gold: 150,
              addItems: ["golden_amulet"],
              questProgress: { "ancient_temple": 70 }
            }
          },
          {
            id: "continue_deeper",
            text: "Continue deeper into the temple",
            requirement: "Stealth Skill",
            risk: "moderate",
            nextStoryId: "temple_depths",
            effects: {
              energy: -20,
              questProgress: { "ancient_temple": 55 }
            }
          }
        ]
      },
      {
        id: "rune_discovery",
        title: "Ancient Wisdom",
        chapter: "Chapter 2",
        content: [
          "You spend considerable time studying the intricate runes carved into the archway. Your knowledge of ancient languages begins to unlock their meaning.",
          "The runes tell a story of a powerful artifact hidden deep within the temple - the Crystal of Eternal Light. But they also warn of the terrible curse that befell the last guardian who tried to claim it.",
          "Armed with this knowledge, you now understand the true nature of your quest. The artifact you seek is indeed here, but the path ahead is more dangerous than you imagined..."
        ],
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400",
        choices: [
          {
            id: "enter_prepared",
            text: "Enter the temple with newfound knowledge",
            requirement: "Magic Knowledge",
            risk: "moderate",
            nextStoryId: "temple_hall",
            effects: {
              energy: -5,
              addItems: ["protective_ward"],
              questProgress: { "ancient_temple": 45, "lost_artifact": 35 }
            }
          },
          {
            id: "seek_more_info",
            text: "Search for more clues around the temple",
            requirement: "Investigation",
            risk: "low",
            nextStoryId: "temple_grounds",
            effects: {
              energy: -10,
              addItems: ["temple_map"],
              questProgress: { "ancient_temple": 30 }
            }
          },
          {
            id: "return_village",
            text: "Return to the village to gather supplies",
            requirement: "Wisdom",
            risk: "info",
            nextStoryId: "village_return",
            effects: {
              energy: 20,
              gold: -50,
              addItems: ["healing_potion", "torch"],
              questProgress: { "ancient_temple": 20 }
            }
          }
        ]
      }
    ];

    initialStories.forEach(story => {
      this.stories.set(story.id, story);
    });
  }

  async getPlayer(sessionId: string): Promise<Player | undefined> {
    return this.players.get(sessionId);
  }

  async createPlayer(insertPlayer: InsertPlayer): Promise<Player> {
    const player: Player = {
      id: this.currentId++,
      ...insertPlayer,
    };
    this.players.set(player.sessionId, player);
    return player;
  }

  async updatePlayer(sessionId: string, updates: UpdatePlayer): Promise<Player | undefined> {
    const player = this.players.get(sessionId);
    if (!player) return undefined;

    const updatedPlayer = { ...player, ...updates };
    this.players.set(sessionId, updatedPlayer);
    return updatedPlayer;
  }

  async getStory(storyId: string): Promise<Story | undefined> {
    return this.stories.get(storyId);
  }

  async getAllStories(): Promise<Story[]> {
    return Array.from(this.stories.values());
  }

  async makeChoice(choice: MakeChoice): Promise<void> {
    const playerChoices = this.choices.get(choice.sessionId) || [];
    playerChoices.push(choice);
    this.choices.set(choice.sessionId, playerChoices);
  }

  async getPlayerChoices(sessionId: string): Promise<string[]> {
    const choices = this.choices.get(sessionId) || [];
    return choices.map(choice => choice.choiceId);
  }
}

export const storage = new MemStorage();
