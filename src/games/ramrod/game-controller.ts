// Ramrod Game Controller
// Manages game flow, AI, and UI updates

import { RamrodState, Player } from './types';
import {
  createInitialState,
  selectRod,
  clearSelection,
  placeRod,
  passTurn,
  hasValidMoves,
} from './rules';
import { getAIMove, AIDifficulty } from './ai';
import {
  renderBoard,
  renderPlayerRods,
  renderScores,
  renderMoveHistory,
  injectRamrodStyles,
  getPlayerName,
} from './board-ui';

// =============================================================================
// Game Controller
// =============================================================================

export interface RamrodGameController {
  state: RamrodState;
  container: HTMLElement;
  isAI: boolean;
  aiPlayer: Player | null;
  aiDifficulty: AIDifficulty;
  update: () => void;
  newGame: (vsAI: boolean, difficulty?: AIDifficulty) => void;
}

/**
 * Initialize the game
 */
export function initGame(container: HTMLElement, vsAI: boolean = false, difficulty: AIDifficulty = 'medium'): RamrodGameController {
  injectRamrodStyles();

  const controller: RamrodGameController = {
    state: createInitialState(),
    container,
    isAI: vsAI,
    aiPlayer: vsAI ? 'player2' : null,
    aiDifficulty: difficulty,
    update: () => {},
    newGame: () => {},
  };

  controller.update = () => updateUI(controller);
  controller.newGame = (vsAI: boolean, diff?: AIDifficulty) => {
    controller.state = createInitialState();
    controller.isAI = vsAI;
    controller.aiPlayer = vsAI ? 'player2' : null;
    controller.aiDifficulty = diff || controller.aiDifficulty;
    controller.update();
  };

  controller.update();

  return controller;
}

/**
 * Update the UI
 */
function updateUI(controller: RamrodGameController): void {
  const { container, state } = controller;
  container.innerHTML = '';

  // Main game area
  const gameArea = document.createElement('div');
  gameArea.className = 'ramrod-game-area';

  // Status bar
  const status = document.createElement('div');
  status.className = `ramrod-status ${state.currentPlayer}`;

  if (state.winner) {
    status.textContent = `${getPlayerName(state.winner)} wins with ${state.scores[state.winner]}cm!`;
  } else if (state.winner === null && state.phase === 'gameOver') {
    status.textContent = "It's a tie!";
  } else if (state.phase === 'selectingRod') {
    status.textContent = `${getPlayerName(state.currentPlayer)}'s turn - Select a rod`;
  } else if (state.phase === 'placingRod') {
    status.textContent = `${getPlayerName(state.currentPlayer)} - Place rod in a valid box`;
  }

  gameArea.appendChild(status);

  // Scores
  gameArea.appendChild(renderScores(state));

  // Winner banner
  if (state.phase === 'gameOver') {
    const banner = document.createElement('div');
    banner.className = 'ramrod-winner-banner';
    if (state.winner) {
      banner.textContent = `${getPlayerName(state.winner)} Wins! 🎉`;
    } else {
      banner.textContent = "It's a Tie! 🤝";
    }
    gameArea.appendChild(banner);
  }

  // Main layout
  const mainLayout = document.createElement('div');
  mainLayout.className = 'ramrod-main-layout';

  // Player 1 rods
  const p1Container = document.createElement('div');
  const p1Label = document.createElement('div');
  p1Label.className = 'ramrod-hand-label player1';
  p1Label.textContent = `Blue (${state.playerRods.player1.length})`;
  p1Container.appendChild(p1Label);
  p1Container.appendChild(
    renderPlayerRods(state, 'player1', (rodId) => handleRodClick(controller, rodId))
  );

  // Board
  const board = renderBoard(state, (boxId, slot) => handleBoxClick(controller, boxId, slot));

  // Player 2 rods
  const p2Container = document.createElement('div');
  const p2Label = document.createElement('div');
  p2Label.className = 'ramrod-hand-label player2';
  p2Label.textContent = `Red (${state.playerRods.player2.length})`;
  p2Container.appendChild(p2Label);
  p2Container.appendChild(
    renderPlayerRods(state, 'player2', (rodId) => handleRodClick(controller, rodId))
  );

  mainLayout.appendChild(p1Container);
  mainLayout.appendChild(board);
  mainLayout.appendChild(p2Container);

  gameArea.appendChild(mainLayout);

  // Move history
  if (state.moveHistory.some((m) => m.capturedBox)) {
    gameArea.appendChild(renderMoveHistory(state));
  }

  // Controls
  const controls = document.createElement('div');
  controls.className = 'ramrod-controls';

  if (state.selectedRod) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'ramrod-btn ramrod-btn-secondary';
    clearBtn.textContent = 'Clear Selection';
    clearBtn.addEventListener('click', () => {
      controller.state = clearSelection(state);
      controller.update();
    });
    controls.appendChild(clearBtn);
  }

  if (!hasValidMoves(state) && state.phase !== 'gameOver') {
    const passBtn = document.createElement('button');
    passBtn.className = 'ramrod-btn ramrod-btn-secondary';
    passBtn.textContent = 'Pass Turn';
    passBtn.addEventListener('click', () => {
      controller.state = passTurn(state);
      controller.update();
    });
    controls.appendChild(passBtn);
  }

  const newGameBtn = document.createElement('button');
  newGameBtn.className = 'ramrod-btn ramrod-btn-primary';
  newGameBtn.textContent = 'New Game';
  newGameBtn.addEventListener('click', () => {
    controller.newGame(controller.isAI);
  });
  controls.appendChild(newGameBtn);

  gameArea.appendChild(controls);
  container.appendChild(gameArea);

  // AI turn
  if (
    controller.isAI &&
    controller.aiPlayer === state.currentPlayer &&
    state.phase !== 'gameOver'
  ) {
    setTimeout(() => makeAIMove(controller), 800);
  }
}

/**
 * Handle rod click
 */
function handleRodClick(controller: RamrodGameController, rodId: string): void {
  controller.state = selectRod(controller.state, rodId);
  controller.update();
}

/**
 * Handle box click
 */
function handleBoxClick(controller: RamrodGameController, boxId: string, slot: number): void {
  controller.state = placeRod(controller.state, boxId, slot);
  controller.update();
}

// =============================================================================
// AI Logic
// =============================================================================

/**
 * Make an AI move using the AI module
 */
function makeAIMove(controller: RamrodGameController): void {
  const { state, aiPlayer, aiDifficulty } = controller;

  if (state.phase === 'gameOver' || !aiPlayer) return;

  // Get AI move using the AI module
  const move = getAIMove(state, aiPlayer, aiDifficulty);

  if (!move) {
    // No valid moves, pass
    controller.state = passTurn(state);
    controller.update();
    return;
  }

  // Execute move step by step
  let newState = selectRod(state, move.rodId);
  newState = placeRod(newState, move.boxId, move.slot);

  controller.state = newState;
  controller.update();
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Create a new game vs human
 */
export function newGameVsHuman(container: HTMLElement): RamrodGameController {
  return initGame(container, false);
}

/**
 * Create a new game vs AI
 */
export function newGameVsAI(container: HTMLElement): RamrodGameController {
  return initGame(container, true);
}
