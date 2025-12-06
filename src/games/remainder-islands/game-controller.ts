// Remainder Islands Game Controller
// Orchestrates game state, UI, and player interactions

import {
  RemainderIslandsState,
  createInitialState,
} from './types';
import {
  performRoll,
  selectIsland,
  setSelectedIsland,
} from './rules';
import {
  renderBoard,
  renderDice,
  renderScores,
  renderDivisionPreview,
  renderGameOver,
  getPlayerName,
  injectRemainderIslandsStyles,
} from './board-ui';

// =============================================================================
// Module State
// =============================================================================

let gameState: RemainderIslandsState;
let gameContainer: HTMLElement | null = null;
let isAIMode = false;

// =============================================================================
// Rendering
// =============================================================================

function render(): void {
  if (!gameContainer) return;

  gameContainer.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'remainder-game-container';

  // Scores
  wrapper.appendChild(renderScores(gameState));

  // Game over or active game
  if (gameState.phase === 'gameOver') {
    wrapper.appendChild(renderGameOver(gameState));
  } else {
    // Current player status
    const status = document.createElement('div');
    status.className = `remainder-status ${gameState.currentPlayer}`;
    status.textContent = `${getPlayerName(gameState.currentPlayer)}'s turn`;
    wrapper.appendChild(status);

    // Dice
    wrapper.appendChild(renderDice(gameState.currentRoll));

    // Roll button or selection instruction
    const controls = document.createElement('div');
    controls.className = 'remainder-controls';

    if (gameState.phase === 'rolling') {
      const rollBtn = document.createElement('button');
      rollBtn.className = 'remainder-btn remainder-btn-roll';
      rollBtn.textContent = '🎲 Roll Dice';
      rollBtn.addEventListener('click', handleRoll);
      controls.appendChild(rollBtn);
    } else if (gameState.phase === 'selectIsland') {
      const instruction = document.createElement('div');
      instruction.className = 'remainder-instruction';
      instruction.textContent = 'Select an island to land on';
      controls.appendChild(instruction);

      // Division preview
      wrapper.appendChild(renderDivisionPreview(gameState));
    }

    wrapper.appendChild(controls);

    // Board
    wrapper.appendChild(renderBoard(gameState, handleIslandClick, handleIslandHover));
  }

  gameContainer.appendChild(wrapper);

  // AI turn
  if (isAIMode && gameState.phase !== 'gameOver' && gameState.currentPlayer === 'player2') {
    if (gameState.phase === 'rolling') {
      setTimeout(aiRoll, 800);
    } else if (gameState.phase === 'selectIsland') {
      setTimeout(aiSelectIsland, 800);
    }
  }
}

// =============================================================================
// Event Handlers
// =============================================================================

function handleRoll(): void {
  if (gameState.phase !== 'rolling') return;
  gameState = performRoll(gameState);
  render();
}

function handleIslandClick(islandId: string): void {
  if (gameState.phase !== 'selectIsland') return;
  if (!gameState.validIslands.includes(islandId)) return;

  gameState = selectIsland(gameState, islandId);
  render();
}

function handleIslandHover(islandId: string | null): void {
  if (gameState.phase !== 'selectIsland') return;

  gameState = setSelectedIsland(gameState, islandId);
  render();
}

// =============================================================================
// AI
// =============================================================================

function aiRoll(): void {
  if (gameState.phase !== 'rolling' || gameState.currentPlayer !== 'player2') return;
  handleRoll();
}

function aiSelectIsland(): void {
  if (gameState.phase !== 'selectIsland' || gameState.currentPlayer !== 'player2') return;

  const validIslands = gameState.validIslands;
  if (validIslands.length === 0) return;

  // AI strategy: choose island that gives highest remainder
  let bestIsland = validIslands[0];
  let bestRemainder = -1;

  for (const islandId of validIslands) {
    const island = gameState.islands.find(i => i.id === islandId);
    if (!island || !gameState.currentRoll) continue;

    const remainder = gameState.currentRoll.total % island.value;

    // Prefer higher remainders, but also consider blocking opponent
    let score = remainder;

    // Bonus for unowned islands
    if (island.owner === null) {
      score += 0.5;
    }

    if (score > bestRemainder) {
      bestRemainder = score;
      bestIsland = islandId;
    }
  }

  gameState = selectIsland(gameState, bestIsland);
  render();
}

// =============================================================================
// Public API
// =============================================================================

export function initGame(containerEl: HTMLElement): void {
  injectRemainderIslandsStyles();
  gameContainer = containerEl;
  gameState = createInitialState();
  isAIMode = false;
  render();
}

export function newGameVsHuman(): void {
  gameState = createInitialState();
  isAIMode = false;
  render();
}

export function newGameVsAI(): void {
  gameState = createInitialState();
  isAIMode = true;
  render();
}

export function getCurrentState(): RemainderIslandsState {
  return gameState;
}
