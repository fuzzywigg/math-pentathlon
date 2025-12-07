// Stars & Bars Game Controller
// Manages game flow, AI, and UI updates

import { StarsState, Player } from './types';
import {
  createInitialState,
  selectCard,
  clearSelection,
  placeCard,
  passTurn,
  hasValidMoves,
} from './rules';
import { getAIMove, AIDifficulty } from './ai';
import {
  renderBoard,
  renderPlayerHand,
  renderScores,
  renderMoveHistory,
  injectStarsStyles,
  getPlayerName,
} from './board-ui';

// =============================================================================
// Game Controller
// =============================================================================

export interface StarsGameController {
  state: StarsState;
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
export function initGame(container: HTMLElement, vsAI: boolean = false, difficulty: AIDifficulty = 'medium'): StarsGameController {
  injectStarsStyles();

  const controller: StarsGameController = {
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
function updateUI(controller: StarsGameController): void {
  const { container, state } = controller;
  container.innerHTML = '';

  // Main game area
  const gameArea = document.createElement('div');
  gameArea.className = 'stars-game-area';

  // Status bar
  const status = document.createElement('div');
  status.className = `stars-status ${state.currentPlayer}`;

  if (state.winner) {
    status.textContent = `${getPlayerName(state.winner)} wins with ${state.playerScores[state.winner]} points!`;
  } else if (state.winner === null && state.phase === 'gameOver') {
    status.textContent = "It's a tie!";
  } else if (state.phase === 'selectingCard') {
    status.textContent = `${getPlayerName(state.currentPlayer)}'s turn - Select a card`;
  } else if (state.phase === 'placingCard') {
    status.textContent = `${getPlayerName(state.currentPlayer)} - Place card on a green cell`;
  }

  gameArea.appendChild(status);

  // Scores
  gameArea.appendChild(renderScores(state));

  // Winner banner
  if (state.phase === 'gameOver') {
    const banner = document.createElement('div');
    banner.className = 'stars-winner-banner';
    if (state.winner) {
      banner.textContent = `${getPlayerName(state.winner)} Wins!`;
    } else {
      banner.textContent = "It's a Tie!";
    }
    gameArea.appendChild(banner);
  }

  // Main layout
  const mainLayout = document.createElement('div');
  mainLayout.className = 'stars-main-layout';

  // Player 1 hand
  mainLayout.appendChild(
    renderPlayerHand(state, 'player1', (cardId) => handleCardClick(controller, cardId))
  );

  // Board
  mainLayout.appendChild(
    renderBoard(state, (row, col) => handleCellClick(controller, row, col))
  );

  // Player 2 hand
  mainLayout.appendChild(
    renderPlayerHand(state, 'player2', (cardId) => handleCardClick(controller, cardId))
  );

  // Move history
  if (state.moveHistory.length > 0) {
    mainLayout.appendChild(renderMoveHistory(state));
  }

  gameArea.appendChild(mainLayout);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'stars-controls';

  if (state.selectedCard) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'stars-btn stars-btn-secondary';
    clearBtn.textContent = 'Clear Selection';
    clearBtn.addEventListener('click', () => {
      controller.state = clearSelection(state);
      controller.update();
    });
    controls.appendChild(clearBtn);
  }

  if (!hasValidMoves(state) && state.phase !== 'gameOver') {
    const passBtn = document.createElement('button');
    passBtn.className = 'stars-btn stars-btn-secondary';
    passBtn.textContent = 'Pass Turn';
    passBtn.addEventListener('click', () => {
      controller.state = passTurn(state);
      controller.update();
    });
    controls.appendChild(passBtn);
  }

  const newGameBtn = document.createElement('button');
  newGameBtn.className = 'stars-btn stars-btn-primary';
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
 * Handle card click
 */
function handleCardClick(controller: StarsGameController, cardId: string): void {
  controller.state = selectCard(controller.state, cardId);
  controller.update();
}

/**
 * Handle cell click
 */
function handleCellClick(controller: StarsGameController, row: number, col: number): void {
  controller.state = placeCard(controller.state, row, col);
  controller.update();
}

// =============================================================================
// AI Logic
// =============================================================================

/**
 * Make an AI move using the AI module
 */
function makeAIMove(controller: StarsGameController): void {
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
  let newState = selectCard(state, move.cardId);
  newState = placeCard(newState, move.row, move.col);

  controller.state = newState;
  controller.update();
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Create a new game vs human
 */
export function newGameVsHuman(container: HTMLElement): StarsGameController {
  return initGame(container, false);
}

/**
 * Create a new game vs AI
 */
export function newGameVsAI(container: HTMLElement): StarsGameController {
  return initGame(container, true);
}
