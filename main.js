// Debug version - main.js
console.log("=== SCRIPT STARTING ===");
import { itemData, originalInventory } from './scripts/itemData.js';
import {
    addItemOnce,
    updateInventoryDisplay,
    resetInventory
} from './scripts/inventory.js';
import { updateEquipmentDisplay } from './scripts/equipment.js';


let xp = 0;
let hasGainedXP = false;
let inventory = [];
let scenes = {};
let choices = {};



// Backgrounds
const backgrounds = {
    start: "https://i.postimg.cc/XYQ6xMYy/goblin-village-background-clean.png",
    call_out: "https://i.postimg.cc/wgDNcMwh/goblin-village-background-arrow.png",
    dig_ashes: "#440000",
    wander_off: "#003300",
    name_chosen: "https://i.postimg.cc/zBDgMCzd/village-feet.png",
    examine_self_1: "https://i.postimg.cc/zBDgMCzd/village-feet.png",
    shiny: "",
    headless: "",
    try_key: ""
};

function addScene(id, text, choiceArray, entryDescription = "") {
    scenes[id] = { text, entryDescription };
    choices[id] = choiceArray;
    console.log(`✓ Scene added: ${id} with ${choiceArray.length} choices`);
}

function showScene(key) {
    console.log(`\n=== SHOWING SCENE: ${key} ===`);

    const storyBox = document.getElementById("story");
    const choicesContainer = document.getElementById("choices");

    console.log("Story element:", storyBox);
    console.log("Choices element:", choicesContainer);

    if (!storyBox) {
        console.error("❌ Story element not found!");
        return;
    }

    if (!choicesContainer) {
        console.error("❌ Choices container not found!");
        return;
    }

    // Set story text
    const sceneText = scenes[key]?.text || `Scene "${key}" not found`;
    storyBox.innerText = sceneText;
    console.log("✓ Story text set:", sceneText.substring(0, 50) + "...");

    // Clear existing choices
    choicesContainer.innerHTML = "";
    console.log("✓ Choices cleared");

    // Create choice buttons
    const currentChoices = choices[key] || [];
    console.log(`Creating ${currentChoices.length} choice buttons for scene ${key}`);

    if (currentChoices.length === 0) {
        console.error(`❌ No choices found for scene: ${key}`);
        choicesContainer.innerHTML = "<p style='color: red;'>ERROR: No choices available</p>";
        return;
    }

    currentChoices.forEach((choice, index) => {
        console.log(`Creating button ${index + 1}: "${choice.text}" -> ${choice.next}`);

        const btn = document.createElement("button");
        btn.textContent = choice.text;
        btn.classList.add("choice");

        // Add inline styles to make sure button is visible
        btn.style.cssText = `
            display: block;
            width: 100%;
            padding: 12px;
            margin: 8px 0;
            background-color: #333;
            color: #ffee88;
            border: 2px solid #ffee88;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            font-family: inherit;
        `;

        btn.onmouseover = () => {
            btn.style.backgroundColor = "#555";
        };

        btn.onmouseout = () => {
            btn.style.backgroundColor = "#333";
        };

        btn.onclick = () => {
            console.log(`🔘 Choice clicked: "${choice.text}" -> ${choice.next}`);
            if (choice.next === "start") {
                resetGame();
            } else {
                showScene(choice.next);
            }
        };

        choicesContainer.appendChild(btn);
        console.log(`✓ Button ${index + 1} added to DOM`);
    });

    console.log(`✓ All ${currentChoices.length} buttons created for scene ${key}`);

    // Handle special scenes
    handleSpecialScenes(key);

    // Set background
    setBackground(backgrounds[key] || backgrounds.start);

    // Update displays
    updateInventoryDisplay();
    updateEquipmentDisplay();
}


function makeDraggable(el) {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

  el.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    el.style.top = (el.offsetTop - pos2) + "px";
    el.style.left = (el.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


function handleSpecialScenes(key) {
    const nameInput = document.getElementById("name-input");
    const nameDisplay = document.getElementById("player-name");

    if (key === "wander_off") {
        const name = nameDisplay?.textContent || "Unknown Goblin";
        const msg = `🌿 You wander into the brush. <br><strong>Name:</strong> ${name}`;
        const descBox = document.getElementById("messages");
        if (descBox) {
            descBox.innerHTML = msg;
            descBox.style.display = "block";
        }
        addItemOnce("Bone Dagger");
        console.log("✓ Wander off scene handled");
    }

    if (key === "examine_self_1" && nameDisplay && !nameDisplay.textContent) {
        nameInput.style.display = "inline-block";
        nameInput.focus();
        nameInput.onkeydown = (e) => {
            if (e.key === "Enter" && nameInput.value.trim()) {
                const name = nameInput.value.trim();
                nameDisplay.textContent = name;
                nameDisplay.style.display = "inline";
                nameInput.style.display = "none";
                nameInput.value = "";

                xp = 1;
                document.getElementById("xp").textContent = `🧠 XP: ${xp}`;
                document.getElementById("status-bar").style.display = "block";
                showScene("name_chosen");
            }
        };
        console.log("✓ Name input activated");
    } else {
        if (nameInput) nameInput.style.display = "none";
    }
}

function setBackground(value) {
    if (value && value.startsWith("http")) {
        document.body.style.backgroundImage = `url('${value}')`;
        document.body.style.backgroundColor = "";
        console.log("✓ Background image set:", value);
    } else if (value) {
        document.body.style.backgroundImage = "none";
        document.body.style.backgroundColor = value;
        console.log("✓ Background color set:", value);
    }
}

function resetGame() {
    console.log("\n=== RESETTING GAME ===");

    // Reset XP and flags
    xp = 0;
    hasGainedXP = false;
    document.getElementById("xp").innerText = `🧠 XP: ${xp}`;

    // Reset player name
    const nameDisplay = document.getElementById("player-name");
    const nameInput = document.getElementById("name-input");

    if (nameDisplay) {
        nameDisplay.textContent = "";
        nameDisplay.style.display = "none";
    }
    if (nameInput) {
        nameInput.value = "";
        nameInput.style.display = "none";
    }

    // Reset inventory
    resetInventory(originalInventory);

    // Clear messages
    const descBox = document.getElementById("messages");
    if (descBox) {
        descBox.innerText = "";
        descBox.style.display = "none";
    }

    // Show the first scene
    showScene("start");
    console.log("✓ Game reset complete");
}

// Add all scenes
console.log("\n=== ADDING SCENES ===");

addScene(
    "start",
    `You come to in the ashes of your burnt-down home.
You clutch Beetle-Boo, your favorite plush beetle.
The world feels too quiet now. What do you do?`,
    [
        { text: "Call out for anyone who might have survived", next: "call_out" },
        { text: "Examine yourself", next: "examine_self_1" },
        { text: "Wander away — anywhere but here", next: "wander_off" }
    ]
);

addScene(
    "call_out",
    "You call out.\nA split moment in time happens.\nYou hear a whistle.",
    [{ text: "Maybe your victory is in another answer.", next: "start" }]
);

addScene(
    "examine_self_1",
    "You have feeling of self",
    [{ text: "Enter consciousness", next: "name_chosen" }]
);

addScene(
    "name_chosen",
    "You look down at yourself\nYou feel known\nYou also see something shiny",
    [
        { text: "Call out", next: "call_out" },
        { text: "Grab for the shiny", next: "shiny" },
        { text: "Look around more", next: "start" }
    ]
);

addScene(
    "shiny",
    `You grasp the shiny item
It feels hard
You look close
You found Beetle-Boo's eye`,
    [
        { text: "Eat the eye", next: "start" },
        { text: "Rip open Beetle-Boo's head", next: "headless" }
    ]
);

addScene(
    "headless",
    `You rip apart your childhood toy.
Inside you discover a crude key—crude enough to possibly unlock the chains around your ankle.`,
    [
        { text: "Call out", next: "call_out" },
        { text: "Try the key", next: "try_key" },
        { text: "Wander off", next: "wander_off" }
    ]
);

addScene(
    "try_key",
    `The key trembles slightly in your fingers.
You insert it into the shackle's lock...
*click.*
It opens.
You are no longer bound.`,
    [
        { text: "Stand up and look around", next: "wander_off" },
        { text: "Pocket the key and call out", next: "call_out" }
    ]
);

addScene(
    "wander_off",
    "You stand up slowly, soot slipping from your arms like powder.\nYou step away from what's left behind.",
    [
        { text: "Start Over", next: "start" },
        { text: "Examine yourself", next: "name_chosen" },
        { text: "Continue wandering", next: "wander_off" }
    ]
);

console.log("✓ All scenes added");

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("\n=== DOM LOADED - INITIALIZING GAME ===");

    // Apply styles to panels
    const inventoryStyle = `
        position: fixed;
        top: 3.5rem;
        right: 1rem;
        width: 200px;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.8);
        border: 2px solid #ffee88;
        border-radius: 8px;
        padding: 15px;
        color: #ffee88;
    `;

    const equipmentStyle = `
        position: fixed;
        top: 3.5rem;
        left: 1rem;
        width: 200px;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.8);
        border: 2px solid #ffee88;
        border-radius: 8px;
        padding: 15px;
        color: #ffee88;
    `;

    const inventoryEl = document.getElementById("inventory");
    const equipmentEl = document.getElementById("equipment");

    if (inventoryEl) {
        inventoryEl.style.cssText = inventoryStyle;
        console.log("✓ Inventory styles applied");
    } else {
        console.error("❌ Inventory element not found!");
    }

    if (equipmentEl) {
        equipmentEl.style.cssText = equipmentStyle;
        console.log("✓ Equipment styles applied");
    } else {
        console.error("❌ Equipment element not found!");
    }
    if (inventoryEl) makeDraggable(inventoryEl);
    // Initialize game
    resetGame();

    // Debug check after a short delay
    setTimeout(() => {
        console.log("\n=== FINAL DEBUG CHECK ===");
        const storyExists = !!document.getElementById("story");
        const choicesExists = !!document.getElementById("choices");
        const buttonsCount = document.querySelectorAll(".choice").length;
        const inventoryItems = document.querySelectorAll("#inventory-list li").length;
        const equipmentItems = document.querySelectorAll("#equipment-list div").length;

        console.log(`Story element exists: ${storyExists}`);
        console.log(`Choices element exists: ${choicesExists}`);
        console.log(`Choice buttons created: ${buttonsCount}`);
        console.log(`Inventory items: ${inventoryItems}`);
        console.log(`Equipment items: ${equipmentItems}`);

        if (buttonsCount === 0) {
            console.error("❌ PROBLEM: No choice buttons were created!");
        } else {
            console.log("✅ SUCCESS: Buttons should be visible!");
        }
    }, 500);
});

console.log("=== SCRIPT LOADED ===");