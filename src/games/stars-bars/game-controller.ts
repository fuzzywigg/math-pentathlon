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
import { getAIMove, isAITurn, AIDifficulty } from './ai';
import {
  renderBoard,
  renderPlayerHand,
  renderScores,
  renderMoveHistory,
  injectStarsStyles,
  getPlayerName,
} from './board-ui';
import { tutorialManager } from '../../core/tutorial';
import { starsBarsTutorial } from './tutorial';
import { applyGameModeChrome, seatIcon } from '../../ui/player-colors';
import { clearElement } from '../../core/dom-security';

import {
  captureFocusedCell,
  restoreGridFocus,
  markStatusLive,
} from '../../ui/board-a11y';

/** UX think pause before the computer acts (keep under ~1s). */
const AI_THINK_MS = 450;

function syncOpponentChrome(isAI: boolean): void {
  const root = document.getElementById('app');
  if (!root) return;
  applyGameModeChrome(root, isAI ? 'human-vs-ai' : 'human-vs-human');
}

/** True while it is the computer's seat (including the think pause). */
function isComputerTurnPending(controller: StarsGameController): boolean {
  return isAITurn(
    controller.state,
    controller.aiPlayer,
    controller.isAI ? 'human-vs-ai' : 'human-vs-human'
  );
}

/**
 * Single pending AI timer — avoids stacked setTimeouts from every UI rebuild
 * and stale timers after New Game / re-init.
 */
let aiTimer: ReturnType<typeof setTimeout> | null = null;

function clearAiTimer(): void {
  if (aiTimer !== null) {
    clearTimeout(aiTimer);
    aiTimer = null;
  }
}

function scheduleAI(controller: StarsGameController, delayMs: number): void {
  clearAiTimer();
  aiTimer = setTimeout(() => {
    aiTimer = null;
    makeAIMove(controller);
  }, delayMs);
}

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

/** Last initialized board container — used by startTutorial. */
let activeContainer: HTMLElement | null = null;

/**
 * Initialize the game
 */
export function initGame(
  container: HTMLElement,
  vsAI: boolean = false,
  difficulty: AIDifficulty = 'medium'
): StarsGameController {
  injectStarsStyles();
  activeContainer = container;
  clearAiTimer();

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
    clearAiTimer();
    controller.state = createInitialState();
    controller.isAI = vsAI;
    controller.aiPlayer = vsAI ? 'player2' : null;
    controller.aiDifficulty = diff || controller.aiDifficulty;
    syncOpponentChrome(vsAI);
    controller.update();
  };

  syncOpponentChrome(vsAI);
  controller.update();

  return controller;
}

/**
 * Update the UI
 */
function updateUI(controller: StarsGameController): void {
  const { container, state } = controller;
  const previousFocus = captureFocusedCell(container);
  clearElement(container);

  // Main game area
  const gameArea = document.createElement('div');
  gameArea.className = 'stars-game-area';

  // Status bar
  const status = document.createElement('div');
  status.className = `stars-status ${state.currentPlayer}`;
  markStatusLive(status);

  const computerTurn = isComputerTurnPending(controller);
  const vsAI = controller.isAI;
  const seat = (p: Player) => getPlayerName(p, vsAI);

  if (state.winner) {
    status.textContent = `${seatIcon(state.winner)} ${seat(state.winner)} wins with ${state.playerScores[state.winner]} points!`;
  } else if (state.winner === null && state.phase === 'gameOver') {
    status.textContent = "It's a tie!";
  } else if (computerTurn) {
    status.classList.add('status-ai-thinking');
    status.textContent = `${seatIcon(state.currentPlayer)} Computer is thinking…`;
  } else if (state.phase === 'selectingCard') {
    status.textContent = vsAI
      ? `${seatIcon(state.currentPlayer)} Your turn — Select a card from your hand`
      : `${seatIcon(state.currentPlayer)} ${seat(state.currentPlayer)}'s turn — Select a card`;
  } else if (state.phase === 'placingCard') {
    status.textContent = vsAI
      ? `${seatIcon(state.currentPlayer)} Your turn — Tap a green cell to place`
      : `${seatIcon(state.currentPlayer)} ${seat(state.currentPlayer)} — Place card on a green cell`;
  }

  gameArea.appendChild(status);

  // Scores
  gameArea.appendChild(renderScores(state, { vsAI }));

  // Winner banner
  if (state.phase === 'gameOver') {
    const banner = document.createElement('div');
    banner.className = 'stars-winner-banner';
    if (state.winner) {
      banner.textContent = `${seat(state.winner)} Wins!`;
    } else {
      banner.textContent = "It's a Tie!";
    }
    gameArea.appendChild(banner);
  }

  // Main layout
  const mainLayout = document.createElement('div');
  mainLayout.className = 'stars-main-layout';
  const inputOpts = { allowInput: !computerTurn, vsAI };

  // Player 1 hand
  mainLayout.appendChild(
    renderPlayerHand(
      state,
      'player1',
      (cardId) => handleCardClick(controller, cardId),
      inputOpts
    )
  );

  // Board
  mainLayout.appendChild(
    renderBoard(
      state,
      (row, col) => handleCellClick(controller, row, col),
      inputOpts
    )
  );

  // Player 2 hand
  mainLayout.appendChild(
    renderPlayerHand(
      state,
      'player2',
      (cardId) => handleCardClick(controller, cardId),
      inputOpts
    )
  );

  // Move history
  if (state.moveHistory.length > 0) {
    mainLayout.appendChild(renderMoveHistory(state, { vsAI }));
  }

  gameArea.appendChild(mainLayout);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'stars-controls';

  if (state.selectedCard && !computerTurn) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'stars-btn stars-btn-secondary';
    clearBtn.textContent = 'Clear Selection';
    clearBtn.type = 'button';
    clearBtn.addEventListener('click', () => {
      if (isComputerTurnPending(controller)) return;
      controller.state = clearSelection(state);
      controller.update();
    });
    controls.appendChild(clearBtn);
  }

  if (!hasValidMoves(state) && state.phase !== 'gameOver' && !computerTurn) {
    const passBtn = document.createElement('button');
    passBtn.className = 'stars-btn stars-btn-secondary stars-pass-btn';
    passBtn.textContent = 'Pass Turn';
    passBtn.type = 'button';
    passBtn.addEventListener('click', () => {
      if (isComputerTurnPending(controller)) return;
      controller.state = passTurn(state);
      controller.update();
    });
    controls.appendChild(passBtn);
  }

  // New Game lives only in shared header chrome (#new-game-btn + modal)
  if (controls.childElementCount > 0) {
    gameArea.appendChild(controls);
  }
  container.appendChild(gameArea);
  restoreGridFocus(container, previousFocus);

  // AI turn — single scheduled timer (clears prior) so rebuilds cannot stack
  if (computerTurn) {
    scheduleAI(controller, AI_THINK_MS);
  } else {
    clearAiTimer();
  }
}

/**
 * Handle card click
 */
function handleCardClick(
  controller: StarsGameController,
  cardId: string
): void {
  if (isComputerTurnPending(controller)) return;
  controller.state = selectCard(controller.state, cardId);
  controller.update();
}

/**
 * Handle cell click
 */
function handleCellClick(
  controller: StarsGameController,
  row: number,
  col: number
): void {
  if (isComputerTurnPending(controller)) return;
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
  // Hard seat guard — refuse to act on the human seat (stale timer safety net)
  if (!isComputerTurnPending(controller)) return;

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
export function newGameVsAI(
  container: HTMLElement,
  difficulty: AIDifficulty = 'medium'
): StarsGameController {
  return initGame(container, true, difficulty);
}

// Start the tutorial (Next-only; How-to modal remains available)
export function startTutorial(): void {
  if (!activeContainer) return;
  newGameVsHuman(activeContainer);

  const unsubscribe = tutorialManager.on((event) => {
    if (event.type === 'completed' || event.type === 'exited') {
      unsubscribe();
      if (event.type === 'completed' && activeContainer) {
        newGameVsHuman(activeContainer);
      }
    }
  });

  tutorialManager.start(starsBarsTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}

/** Cancel pending AI timer and drop mounts (route change / error boundary). */
export function destroyGame(): void {
  clearAiTimer();
  activeContainer = null;
}
