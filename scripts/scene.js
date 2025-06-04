import { addItemOnce } from './inventory.js';
import { updateInventoryDisplay } from './inventory.js';
import { updateEquipmentDisplay } from './equipment.js';
import { setBackground } from './background.js'; // Optional: if you extract background logic
import { itemData } from './itemData.js';


export const scenes = {};
export const choices = {};

let xp = 0;
let hasGainedXP = false;

export function addScene(id, text, choiceArray, entryDescription = "") {
  scenes[id] = { text, entryDescription };
  choices[id] = choiceArray;
}


export function setItemDescription(message) {
  const box = document.getElementById("messages");
  box.innerHTML = message;
  box.style.display = "block";
}
export function showScene(key) {
  const storyBox = document.getElementById("story");
  storyBox.innerText = scenes[key]?.text || "";

  const choicesContainer = document.getElementById("choices");
  choicesContainer.innerHTML = "";

  const nameInput = document.getElementById("name-input");
  const nameDisplay = document.getElementById("player-name");

  const currentChoices = choices[key] || [];

  currentChoices.forEach((choice) => {
    const btn = document.createElement("button");
    btn.textContent = choice.text;
    btn.classList.add("choice");
    btn.onclick = () => {
      if (choice.next === "start") {
        location.reload(); // Or call resetGame() if it's in scope
      } else {
        showScene(choice.next);
      }
    };
    choicesContainer.appendChild(btn);
  });

  if (key === "wander_off") {
    const name = nameDisplay?.textContent || "Unknown Goblin";
    const msg = `🌿 You wander into the brush. <br><strong>Name:</strong> ${name}`;
    const descBox = document.getElementById("messages");
    descBox.innerHTML = msg;
    descBox.style.display = "block";
    addItemOnce("Bone Dagger", true);
  }

  if (typeof setBackground === "function") {
    import('./main.js').then(module => {
      const backgrounds = module.backgrounds;
      if (backgrounds[key]) {
        setBackground(backgrounds[key]);
      }
    });
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

        const xpElem = document.getElementById("xp");
        xpElem.textContent = `🧠 XP: 1`;
        document.getElementById("status-bar").style.display = "block";

        showScene("name_chosen");
      }
    };
  } else {
    nameInput.style.display = "none";
  }

  const descBox = document.getElementById("messages");
  descBox.style.display = "none";
}
