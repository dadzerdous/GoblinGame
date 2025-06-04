import { itemData } from './itemData.js';
import { updateEquipmentDisplay } from './equipment.js'; // This will work after we make equipment.js

export let inventory = [];

export function resetInventory(originalInventory) {
  inventory = originalInventory.map((item) => ({
    ...item,
    equipped: item.name === "Dirty Loin Cloth" // Starts equipped if it's the loincloth
  }));
}

export function addItemByName(name, equip = false) {
  const base = itemData[name];
  if (!base) {
    console.warn(`Unknown item: ${name}`);
    return;
  }

  const newItem = {
    name,
    equipped: equip,
    draggable: base.draggable,
    emoji: base.emoji,
    equippable: base.equippable,
    firesafe: base.firesafe,
    allowedSlots: base.allowedSlots,
    description: base.description
  };
  inventory.push(newItem);
  updateInventoryDisplay();
  updateEquipmentDisplay();
}

export function addItemOnce(name, equip = false) {
  if (!hasItem(name)) {
    addItemByName(name, equip);
  }
}

export function hasItem(name) {
  return inventory.some(item => item.name === name);
}

export function updateInventoryDisplay() {
  const list = document.getElementById("inventory-list");
  list.innerHTML = "";

  inventory.forEach((item) => {
    const li = document.createElement("li");
    const emoji = itemData[item.name]?.emoji || "❓";
    li.textContent = `${emoji} ${item.name}${item.equipped ? " (equipped)" : ""}`;

    li.classList.add("item-button");
    if (item.equipped) li.classList.add("equipped-item");

    li.onmouseenter = (e) => {
      const tooltip = document.getElementById("item-tooltip");
      tooltip.innerText = item.description;
      tooltip.style.display = "block";
      tooltip.style.left = `${e.clientX + 10}px`;
      tooltip.style.top = `${e.clientY + 10}px`;
    };

    li.onmousemove = (e) => {
      const tooltip = document.getElementById("item-tooltip");
      tooltip.style.left = `${e.clientX + 10}px`;
      tooltip.style.top = `${e.clientY + 10}px`;
    };

    li.onmouseleave = () => {
      const tooltip = document.getElementById("item-tooltip");
      tooltip.style.display = "none";
    };

    li.onclick = () => {
      item.equipped = !item.equipped;
      updateInventoryDisplay();
      updateEquipmentDisplay();
    };

    list.appendChild(li);
  });
}