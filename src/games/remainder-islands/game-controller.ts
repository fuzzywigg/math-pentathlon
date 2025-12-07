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
import { getAIIslandChoice, AIDifficulty } from './ai';

// =============================================================================
// Module State
// =============================================================================

let gameState: RemainderIslandsState;
let gameContainer: HTMLElement | null = null;
let isAIMode = false;
let aiDifficulty: AIDifficulty = 'medium';

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

  // Use AI module to get choice
  const choice = getAIIslandChoice(gameState, 'player2', aiDifficulty);

  if (choice) {
    gameState = selectIsland(gameState, choice.islandId);
    render();
  }
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

export function newGameVsAI(difficulty: AIDifficulty = 'medium'): void {
  gameState = createInitialState();
  isAIMode = true;
  aiDifficulty = difficulty;
  render();
}

export function getCurrentState(): RemainderIslandsState {
  return gameState;
}
