// Ramrod Game Controller
// Manages game flow, AI, and UI updates

import type { RamrodState, Player } from './types';
import {
  createInitialState,
  selectRod,
  clearSelection,
  placeRod,
  passTurn,
  hasValidMoves,
} from './rules';
import {
  type AIDifficulty,
  getAIMove,
  isAITurn,
} from './ai';
import {
  renderBoard,
  renderPlayerRods,
  renderScores,
  renderMoveHistory,
  injectRamrodStyles,
  getPlayerName,
} from './board-ui';
import { tutorialManager } from '../../core/tutorial';
import { clearElement } from '../../core/dom-security';
import { ramrodTutorial } from './tutorial';
import { applyGameModeChrome, seatIcon } from '../../ui/player-colors';
import {
  captureFocusedCell,
  restoreGridFocus,
  markStatusLive,
} from '../../ui/board-a11y';
import {
  clearNullableTimeout,
  scheduleGenerationGated,
} from '../../ui/timeout-handle';

function syncOpponentChrome(isAI: boolean): void {
  const root = document.getElementById('app');
  if (!root) {
    return;
  }
  applyGameModeChrome(root, isAI ? 'human-vs-ai' : 'human-vs-human');
}

/** True while it is the computer's seat (including the 800ms think pause). */
function isComputerTurnPending(controller: RamrodGameController): boolean {
  return isAITurn(
    controller.state,
    controller.aiPlayer,
    controller.isAI ? 'human-vs-ai' : 'human-vs-human'
  );
}

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

/** Last initialized board container — used by startTutorial. */
let activeContainer: HTMLElement | null = null;
/** Invalidates nested AI setTimeouts after route leave / new game. */
let aiGeneration = 0;
/** Single pending AI think-delay timer — cleared on destroy / re-schedule. */
let aiTimer: ReturnType<typeof setTimeout> | null = null;

function clearAiTimer(): void {
  aiTimer = clearNullableTimeout(aiTimer);
}

/** Schedule AI work; no-ops if New Game / route leave invalidated the generation. */
function scheduleAI(fn: () => void, delayMs: number): void {
  scheduleGenerationGated(
    {
      clearTimer: clearAiTimer,
      setTimer: (t: ReturnType<typeof setTimeout> | null) => {
        aiTimer = t;
      },
      getGeneration: () => aiGeneration,
    },
    fn,
    delayMs
  );
}

/**
 * Initialize the game
 */
export function initGame(
  container: HTMLElement,
  vsAI: boolean = false,
  difficulty: AIDifficulty = 'medium'
): RamrodGameController {
  injectRamrodStyles();
  activeContainer = container;

  const controller: RamrodGameController = {
    state: createInitialState(),
    container,
    isAI: vsAI,
    aiPlayer: vsAI ? 'player2' : null,
    aiDifficulty: difficulty,
    update: () => {},
    newGame: () => {},
  };

  controller.update = () => {
    updateUI(controller);
  };
  controller.newGame = (vsAI: boolean, diff?: AIDifficulty) => {
    aiGeneration += 1;
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
function updateUI(controller: RamrodGameController): void {
  // Drop paints after destroyGame nulled the mount ref (remount safety).
  if (!activeContainer || controller.container !== activeContainer) {
    return;
  }

  const { container, state } = controller;
  const previousFocus = captureFocusedCell(container);
  container.innerHTML = '';

  // Main game area
  const gameArea = document.createElement('div');
  gameArea.className = 'ramrod-game-area';

  // Status bar
  const status = document.createElement('div');
  status.className = `ramrod-status ${state.currentPlayer}`;
  markStatusLive(status);

  const computerTurn = isComputerTurnPending(controller);

  if (state.winner) {
    status.textContent = `${seatIcon(state.winner)} ${getPlayerName(state.winner)} wins with ${state.scores[state.winner]}cm!`;
  } else if (state.winner === null && state.phase === 'gameOver') {
    status.textContent = "It's a tie!";
  } else if (computerTurn) {
    status.textContent = `${seatIcon(state.currentPlayer)} Computer is thinking…`;
  } else if (state.phase === 'selectingRod') {
    status.textContent = `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)}'s turn - Select a rod`;
  } else if (state.phase === 'placingRod') {
    status.textContent = `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)} - Place rod in a valid box`;
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
  const inputOpts = { allowInput: !computerTurn };

  // Player 1 rods
  const p1Container = document.createElement('div');
  const p1Label = document.createElement('div');
  p1Label.className = 'ramrod-hand-label player1';
  p1Label.textContent = `${seatIcon('player1')} Blue (${state.playerRods.player1.length})`;
  p1Container.appendChild(p1Label);
  p1Container.appendChild(
    renderPlayerRods(
      state,
      'player1',
      (rodId) => {
        handleRodClick(controller, rodId);
      },
      inputOpts
    )
  );

  // Board
  const board = renderBoard(
    state,
    (boxId, slot) => {
      handleBoxClick(controller, boxId, slot);
    },
    inputOpts
  );

  // Player 2 rods
  const p2Container = document.createElement('div');
  const p2Label = document.createElement('div');
  p2Label.className = 'ramrod-hand-label player2';
  p2Label.textContent = `${seatIcon('player2')} Red (${state.playerRods.player2.length})`;
  p2Container.appendChild(p2Label);
  p2Container.appendChild(
    renderPlayerRods(
      state,
      'player2',
      (rodId) => {
        handleRodClick(controller, rodId);
      },
      inputOpts
    )
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

  if (state.selectedRod && !computerTurn) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'ramrod-btn ramrod-btn-secondary';
    clearBtn.textContent = 'Clear Selection';
    clearBtn.addEventListener('click', () => {
      if (isComputerTurnPending(controller)) {
        return;
      }
      controller.state = clearSelection(state);
      controller.update();
    });
    controls.appendChild(clearBtn);
  }

  if (!hasValidMoves(state) && state.phase !== 'gameOver' && !computerTurn) {
    const passBtn = document.createElement('button');
    passBtn.className = 'ramrod-btn ramrod-btn-secondary';
    passBtn.textContent = 'Pass Turn';
    passBtn.addEventListener('click', () => {
      if (isComputerTurnPending(controller)) {
        return;
      }
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

  // AI turn
  if (
    controller.isAI &&
    controller.aiPlayer === state.currentPlayer &&
    state.phase !== 'gameOver'
  ) {
    scheduleAI(() => {
      makeAIMove(controller);
    }, 800);
  }
}

/**
 * Handle rod click
 */
function handleRodClick(controller: RamrodGameController, rodId: string): void {
  if (isComputerTurnPending(controller)) {
    return;
  }
  controller.state = selectRod(controller.state, rodId);
  controller.update();
}

/**
 * Handle box click
 */
function handleBoxClick(
  controller: RamrodGameController,
  boxId: string,
  slot: number
): void {
  if (isComputerTurnPending(controller)) {
    return;
  }
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

  if (state.phase === 'gameOver' || !aiPlayer) {
    return;
  }

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
export function newGameVsAI(
  container: HTMLElement,
  difficulty: AIDifficulty = 'medium'
): RamrodGameController {
  return initGame(container, true, difficulty);
}

// Start the tutorial (Next-only; How-to modal remains available)
export function startTutorial(): void {
  if (!activeContainer) {
    return;
  }
  newGameVsHuman(activeContainer);

  const unsubscribe = tutorialManager.on((event) => {
    if (event.type === 'completed' || event.type === 'exited') {
      unsubscribe();
      if (event.type === 'completed' && activeContainer) {
        newGameVsHuman(activeContainer);
      }
    }
  });

  tutorialManager.start(ramrodTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}

/** Cancel pending AI timers and clear mounts (route change / remount). */
export function destroyGame(): void {
  aiGeneration += 1;
  clearAiTimer();
  if (activeContainer) {
    clearElement(activeContainer);
  }
  activeContainer = null;
}
