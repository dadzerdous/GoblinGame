// script.js
import { originalInventory, itemData } from './scripts/itemData.js';
import {
  inventory,
  resetInventory,
  addItemByName,
  addItemOnce,
  hasItem,
  updateInventoryDisplay
} from './scripts/inventory.js';
import { addScene, showScene } from './scripts/scene.js';
const screenHeight = window.innerHeight;

import {
  equipmentTree,
  equipmentSlots,
  equipItemToSlot,
  updateEquipmentDisplay,
  showEquipMessage,
  makeSnappingDraggable
} from './scripts/equipment.js';




const equipPanel = document.getElementById("equipment");
const panelHeight = equipPanel.scrollHeight;

if (panelHeight > screenHeight * 0.8) {
    equipPanel.style.overflowY = "auto";
    equipPanel.style.maxHeight = `${screenHeight * 0.8}px`;
} else {
    equipPanel.style.overflowY = "visible";
}



const nameInput = document.getElementById("name-input");
const nameDisplay = document.getElementById("player-name");

const inventoryStyle = `
    position: fixed;
    top: 3.5rem;
    right: 1rem;
    width: 200px;
    z-index: 10;
`;

const equipmentStyle = `
    position: fixed;
    top: 3.5rem;
    left: 1rem;
    width: 200px;
    z-index: 10;
`;

const hudStyle = `
    position: fixed;
    top: 0.5rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: #ffee88;
    font-family: monospace;
    padding: 0.75rem 1.5rem;
    border: 2px solid #ffee88;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(255, 238, 136, 0.4);
    z-index: 1000;
`;

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

function showHUD() {
    const hud = document.getElementById("hud-panel");
    hud.style.opacity = "1";
    hud.style.pointerEvents = "auto";
}

// inventory is initialized from originalInventory in resetGame() and at start
 // Temporarily empty, will be populated by resetGame/initial call


document.getElementById("inventory").style.cssText = inventoryStyle;
document.getElementById("equipment").style.cssText = equipmentStyle;
document.getElementById("xp").innerText = `🧠 XP: ${xp}`;



function addToInventory(item) {
    inventory.push(item);
    updateInventoryDisplay();
}



function addToEquipmentOnce(name, options = {}) {
    if (!hasItem(name)) { // This only checks if it's in inventory, not if it's equipped.
        // This function seems to be for adding directly to equipment and not inventory.
        // Given your current flow, addItemOnce (above) might be more suitable if you want it in inventory first.
        const item = {
            name,
            equipped: true,
            draggable: !!options.draggable,
            ...options
        };
        // This part needs more robust equipment slot management
        // For now, it just adds to inventory as equipped
        inventory.push(item);
        updateInventoryDisplay();
        updateEquipmentDisplay();
    }
}

function getEmoji(name) {
    return itemData[name]?.emoji || "🎒";
}







  /*  function drag(e) {
        if (!dragging) return;
        const parentRect = el.parentElement.getBoundingClientRect();
        el.style.left = `${e.clientX - parentRect.left - offsetX}px`;
        el.style.top = `${e.clientY - parentRect.top - offsetY}px`;
    }

    function drop() {
        if (!dragging) return;
        dragging = false;

        const tooltip = document.getElementById("item-tooltip");
        if (tooltip) tooltip.style.display = "none";

        document.onmousemove = null;
        document.onmouseup = null;
        document.body.removeEventListener("mouseleave", drop);
        window.removeEventListener("blur", drop);

        const dropZone = document.getElementById("drop-zone");
        if (dropZone) {
            const dzRect = dropZone.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();

            const isInside =
                elRect.right > dzRect.left &&
                elRect.left < dzRect.right &&
                elRect.bottom > dzRect.top &&
                elRect.top < dzRect.bottom;

            if (isInside) {
                console.log("Dropped in special zone!");
                return;
            }
        }

        // Return to original snapped position
        el.style.left = `${startLeft}px`;
        el.style.top = `${startTop}px`;
    }
}
*/






addScene(
    "start",
    `You come to in the ashes of your burnt-down home.\nYou clutch Beetle-Boo, your favorite plush beetle.\nThe world feels too quiet now. What do you do?`,
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
    [{ text: "Enter consciousnes", next: "name_chosen" }] // Fix for issue 7: Added 'next'
);

addScene(
    "headless",
    `You rip apart your childhood toy.\nInside you discover a crude key—crude enough to possibly unlock the chains around your ankle.`,
    [
        { text: "Call out", next: "call_out" },
        { text: "Try the key", next: "try_key" },
        { text: "Wander off", next: "wander_off" }
    ]
);

addScene(
    "name_chosen",
    "You look down at yourself\nYou feel known\nYou also see something shiny",
    [
        { text: "Call out", next: "call_out" },
        { text: "Grab for the shiny", next: "shiny" },
        { text: "Name Yourself", next: "name_chosen" } // This might loop, consider a different 'next'
    ]
);

addScene(
    "shiny",
    `You grasp a the shiny item\nIt's feels hard\nYou look close\nYou found Beetle-Boo's eye`,
    [
        { text: "Eat the eye", next: "start" },
        { text: "Rip open Beetle-Boos head", next: "headless" }
    ]
);

addScene(
    "try_key",
    `The key trembles slightly in your fingers.\nYou insert it into the shackle's lock...\n*click.*\nIt opens.\nYou are no longer bound.`,
    [
        { text: "Stand up and look around", next: "wander_off" },
        { text: "Pocket the key and call out", next: "call_out" },
        { text: "Inspect the shackle more closely", next: "inspect_shackle" } // ← optional to define later
    ]
);

addScene(
    "wander_off",
    "You stand up slowly, soot slipping from your arms like powder.\nYou step away from what's left behind.\n\n",
    [
        { text: "Start Over", next: "start" },
        { text: "Examine yourself", next: "name_chosen" },
        { text: "Wander away — anywhere but here", next: "wander_off" }
    ],
    "🌿 You feel the ashes of home slip off your skin. XP is now " + xp + "."
);

function getItemDescription(name) {
    return itemData[name]?.description || `${name}: No description available.`;
}

function setBackground(value) {
    if (value.startsWith("http")) {
        document.body.style.backgroundImage = `url('${value}')`;
        document.body.style.backgroundColor = ""; // remove color if switching to image
    } else {
        document.body.style.backgroundImage = "none";
        document.body.style.backgroundColor = value;
    }
}


function makeDraggable(el) {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

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
        el.style.top = el.offsetTop - pos2 + "px";
        el.style.left = el.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// REMOVED: document.querySelectorAll(".draggable").forEach(makeDraggable);
// Per Issue 5, only makeSnappingDraggable should be applied to equipable items.

// RESET

function resetGame() {
    // Reset XP and flags
    xp = 0;
    hasGainedXP = false;
    document.getElementById("xp").innerText = `🧠 XP: ${xp}`;
    document.getElementById("status-bar").style.display = "none";

    // Reset panel positions to layout flow
    document.getElementById("inventory").style.cssText = inventoryStyle;
    document.getElementById("equipment").style.cssText = equipmentStyle;

    // Hide and reset status bar
    const statusBar = document.getElementById("status-bar");
    statusBar.style.display = "none";

    // Reset player name
    nameDisplay.textContent = "";
    nameDisplay.style.display = "none";
    nameInput.value = "";
    nameInput.style.display = "none";

    // Fix for issue 1: Reset inventory from originalInventory, maintaining initial equipped state
    resetInventory(originalInventory);// Ensure equipped state is reset based on original
    // If you want all items to start unequipped on reset, simplify to:
    // inventory = originalInventory.map((item) => ({ ...item, equipped: false }));
    // OR, if you want only the loincloth to start equipped on reset:
    // inventory = originalInventory.map((item) => ({ ...item, equipped: (item.name === "Dirty Loin Cloth") }));

    const invPanel = document.getElementById("inventory");
    const equipPanel = document.getElementById("equipment");

    invPanel.style.cssText = `
        position: fixed;
        top: 3.5rem;
        right: 1rem;
        width: 200px;
        z-index: 10;
    `;

    equipPanel.style.cssText = `
        position: fixed;
        top: 3.5rem;
        left: 1rem;
        width: 200px;
        z-index: 10;
    `;

    // Clear item description
    const descBox = document.getElementById("messages");
    descBox.innerText = "";
    descBox.style.display = "none";

    // Show the first scene
    showScene("start"); // This will now *not* add duplicates

    setBackground(backgrounds.start);

    // After reset, update displays
    updateInventoryDisplay();
    updateEquipmentDisplay();
}


// reset end

// Initial game setup calls (Fix for issue 1, part 4)
resetGame(); // Call resetGame first to initialize inventory and game state
// showScene("start"); // This is already called by resetGame()
// updateInventoryDisplay(); // These are now called by resetGame()
// updateEquipmentDisplay(); // These are now called by resetGame()
document.querySelectorAll(".draggable").forEach(makeDraggable);