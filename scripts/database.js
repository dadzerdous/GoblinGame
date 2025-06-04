// Database integration for goblin adventure game
let currentSessionId = null;

// Generate or get session ID
export function getSessionId() {
  if (!currentSessionId) {
    currentSessionId = localStorage.getItem('goblin_session_id');
    if (!currentSessionId) {
      currentSessionId = generateSessionId();
      localStorage.setItem('goblin_session_id', currentSessionId);
    }
  }
  return currentSessionId;
}

function generateSessionId() {
  return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// API helper functions
async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (data) {
      options.body = JSON.stringify(data);
    }
    
    const response = await fetch(`/api/${endpoint}`, options);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Player management
export async function loadPlayer() {
  try {
    const sessionId = getSessionId();
    const player = await apiCall(`player?sessionId=${sessionId}`);
    return player;
  } catch (error) {
    console.error('Failed to load player:', error);
    return null;
  }
}

export async function savePlayer(playerData) {
  try {
    const sessionId = getSessionId();
    const data = { sessionId, ...playerData };
    
    // Try to update existing player first
    const existingPlayer = await loadPlayer();
    if (existingPlayer) {
      return await apiCall('player', 'PUT', data);
    } else {
      return await apiCall('player', 'POST', data);
    }
  } catch (error) {
    console.error('Failed to save player:', error);
    return null;
  }
}

export async function saveChoice(scene, choice) {
  try {
    const sessionId = getSessionId();
    const data = { sessionId, scene, choice };
    await apiCall('choice', 'POST', data);
  } catch (error) {
    console.error('Failed to save choice:', error);
  }
}

// Game state management
export async function saveGameState() {
  try {
    const gameState = {
      currentScene: window.currentScene || 'start',
      inventory: window.inventory || [],
      equipment: window.equippedItems || {},
      xp: parseInt(document.getElementById('xp')?.textContent?.replace('XP: ', '') || '0'),
      playerName: document.getElementById('player-name')?.textContent || null
    };
    
    await savePlayer(gameState);
    console.log('✓ Game state saved to database');
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
}

export async function loadGameState() {
  try {
    const player = await loadPlayer();
    if (player) {
      console.log('✓ Loading saved game state from database');
      
      // Restore player name
      if (player.playerName) {
        const nameInput = document.getElementById('name-input');
        const nameSpan = document.getElementById('player-name');
        if (nameInput && nameSpan) {
          nameInput.value = player.playerName;
          nameInput.style.display = 'none';
          nameSpan.textContent = player.playerName;
          nameSpan.style.display = 'inline';
        }
      }
      
      // Restore XP
      const xpElement = document.getElementById('xp');
      if (xpElement && player.xp) {
        xpElement.textContent = `XP: ${player.xp}`;
      }
      
      // Restore inventory
      if (player.inventory && Array.isArray(player.inventory)) {
        window.inventory = player.inventory;
        if (window.updateInventoryDisplay) {
          window.updateInventoryDisplay();
        }
      }
      
      // Restore equipment
      if (player.equipment && typeof player.equipment === 'object') {
        window.equippedItems = player.equipment;
        if (window.updateEquipmentDisplay) {
          window.updateEquipmentDisplay();
        }
      }
      
      // Restore current scene
      if (player.currentScene && player.currentScene !== 'start') {
        if (window.showScene) {
          window.showScene(player.currentScene);
        }
      }
      
      return true;
    }
  } catch (error) {
    console.error('Failed to load game state:', error);
  }
  return false;
}

// Auto-save functionality
let autoSaveInterval;

export function startAutoSave(intervalMs = 30000) { // Save every 30 seconds
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
  }
  
  autoSaveInterval = setInterval(() => {
    saveGameState();
  }, intervalMs);
  
  console.log('✓ Auto-save started (every 30 seconds)');
}

export function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
    console.log('✓ Auto-save stopped');
  }
}

// Save on page unload
window.addEventListener('beforeunload', () => {
  saveGameState();
});