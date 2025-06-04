import { itemData } from './itemData.js';
import { inventory, updateInventoryDisplay } from './inventory.js';

export const equipmentTree = {
  body: {
    head: null,
    chest: null,
    legs: null,
    feet: null,
    trinket: {
      left: null,
      right: null,
      center: null,
      tail: null,
      pouch: null
    }
  }
};

export const equipmentSlots = [
  "body.head",
  "body.chest",
  "body.legs",
  "body.feet",
  "body.trinket.left",
  "body.trinket.right",
  "body.trinket.center",
  "body.trinket.tail",
  "body.trinket.pouch"
];

export function equipItemToSlot(slotPath, itemName) {
  const slotParts = slotPath.split(".");
  let slotRef = equipmentTree;

  for (let i = 0; i < slotParts.length - 1; i++) {
    slotRef = slotRef[slotParts[i]];
  }

  const finalSlot = slotParts[slotParts.length - 1];
  if (slotRef[finalSlot]) {
    return showEquipMessage(`⚠️ Slot ${slotPath} is already occupied.`);
  }

  const item = inventory.find(i => i.name === itemName);
  if (!item) return showEquipMessage(`⚠️ Item ${itemName} not found in inventory.`);
  
  item.equipped = true; 
  slotRef[finalSlot] = item;
  showEquipMessage(`✅ Equipped ${itemName} in ${slotPath}.`);
  updateInventoryDisplay();
  updateEquipmentDisplay();
}

export function updateEquipmentDisplay() {
  const equipmentList = document.getElementById("equipment-list");
  if (!equipmentList) return;

  equipmentList.innerHTML = "";
  equipmentList.style.position = "relative";

  const equippedItems = inventory.filter(item => item.equipped);

  equippedItems.forEach((item) => {
    const li = document.createElement("li");
    const emoji = itemData[item.name]?.emoji || "❓";
    li.textContent = `${emoji} ${item.name}`;

    li.classList.add("item-button", "equipped-item");

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
      item.equipped = false;
      updateInventoryDisplay();
      updateEquipmentDisplay();
    };

    if (item.draggable) {
      li.style.position = "absolute";
      li.style.left = "0px";
      li.style.top = "0px";
      makeSnappingDraggable(li, 0, 0);
    }

    equipmentList.appendChild(li);
  });
}

export function showEquipMessage(msg) {
  const messageBox = document.getElementById("messages");
  messageBox.innerHTML = msg;
  messageBox.style.display = "block";
}

export function makeSnappingDraggable(el, originalLeft, originalTop) {
  let dragging = false;
  let offsetX, offsetY, startLeft = originalLeft, startTop = originalTop;

  el.onmousedown = (e) => {
    dragging = true;
    offsetX = e.offsetX;
    offsetY = e.offsetY;
    document.onmousemove = drag;
    document.onmouseup = drop;
    document.body.addEventListener("mouseleave", drop);
    window.addEventListener("blur", drop);
  };

  function drag(e) {
    if (!dragging) return;
    const parentRect = el.parentElement.getBoundingClientRect();
    el.style.left = `${e.clientX - parentRect.left - offsetX}px`;
    el.style.top = `${e.clientY - parentRect.top - offsetY}px`;
  }

  function drop() {
    if (!dragging) return;
    dragging = false;

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

    el.style.left = `${startLeft}px`;
    el.style.top = `${startTop}px`;
  }
}