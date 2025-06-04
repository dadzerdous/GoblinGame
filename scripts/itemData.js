// scripts/itemData.js

export const originalInventory = [
  {
    name: "Beetle-Boo",
    emoji: "🧸",
    draggable: false,
    equippable: false,
    firesafe: true,
    allowedSlots: ["hands"],
    description: "A soot-covered plush beetle. One eye melted.",
    equipped: false
  },
  {
    name: "Dirty Loin Cloth",
    emoji: "🩲",
    draggable: true,
    equippable: true,
    firesafe: false,
    allowedSlots: ["hands"],
    description: "Grimy, ash-caked, and riding low.",
    equipped: true
  },
  {
    name: "Test Object",
    emoji: "📦",
    draggable: true,
    equippable: false,
    firesafe: true,
    allowedSlots: [],
    description: "A mysterious box. You’re not sure if it’s meant to be opened.",
    equipped: false
  }
];

export const itemData = {
  "Beetle-Boo": {
    emoji: "🧸",
    draggable: false,
    equippable: false,
    firesafe: true,
    allowedSlots: ["hands"],
    description: "A soot-covered plush beetle. One eye melted."
  },
  "Dirty Loin Cloth": {
    emoji: "🩲",
    draggable: true,
    equippable: true,
    firesafe: false,
    allowedSlots: ["chest"],
    description: "Grimy, ash-caked, and riding low."
  },
  "Full Loin Cloth": {
    emoji: "🩲💩",
    draggable: true,
    equippable: true,
    firesafe: false,
    allowedSlots: ["chest"],
    description: "You sphinctersense is tingling."
  },
  "Bone Dagger": {
    emoji: "🦴",
    draggable: false,
    equippable: true,
    firesafe: false,
    allowedSlots: ["hands"],
    description: "A jagged piece of survival. Notched but sharp enough."
  },
  "Test Object": {
    emoji: "📦",
    draggable: false,
    equippable: false,
    firesafe: true,
    allowedSlots: [],
    description: "A mysterious box. You’re not sure if it’s meant to be opened."
  }
};