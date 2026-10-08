// Par 55 Game Controller
// Manages game flow, AI, and UI updates

import { Par55State, Player } from './types';
import {
  createInitialState,
  selectBlock,
  clearSelection,
  placeBlock,
  passTurn,
  hasValidMoves,
} from './rules';
import { getAIMove, isAITurn, AIDifficulty } from './ai';
import {
  renderBoard,
  renderHand,
  renderScores,
  renderMoveHistory,
  injectPar55Styles,
  getPlayerName,
} from './board-ui';
import { tutorialManager } from '../../core/tutorial';
import { par55Tutorial } from './tutorial';
import { seatIcon, syncAppOpponentChrome } from '../../ui/player-colors';
import {
  clearNullableTimeout,
  scheduleGenerationGated,
} from '../../ui/timeout-handle';
import {
  captureFocusedCell,
  restoreGridFocus,
  markStatusLive,
} from '../../ui/board-a11y';

/** Think pause before computer places — kept under ~1s for playability. */
const AI_THINK_DELAY_MS = 450;

/** Single pending AI timer — avoids stacked setTimeouts from UI rebuilds. */
let aiTimer: ReturnType<typeof setTimeout> | null = null;
/** Bumped on init / New Game so stale timers cannot move a fresh match. */
let aiGeneration = 0;

function clearAiTimer(): void {
  aiTimer = clearNullableTimeout(aiTimer);
}

function scheduleAI(controller: Par55GameController, delayMs: number): void {
  scheduleGenerationGated(
    {
      clearTimer: clearAiTimer,
      setTimer: (t: ReturnType<typeof setTimeout> | null) => {
        aiTimer = t;
      },
      getGeneration: () => aiGeneration,
    },
    () => makeAIMove(controller),
    delayMs
  );
}

function syncOpponentChrome(isAI: boolean): void {
  syncAppOpponentChrome(isAI);
}

/** True while it is the computer's seat (including the think pause). */
function isComputerTurnPending(controller: Par55GameController): boolean {
  return isAITurn(
    controller.state,
    controller.aiPlayer,
    controller.isAI ? 'human-vs-ai' : 'human-vs-human'
  );
}

// =============================================================================
// Game Controller
// =============================================================================

export interface Par55GameController {
  state: Par55State;
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
): Par55GameController {
  injectPar55Styles();
  activeContainer = container;
  // Invalidate any prior controller's pending AI callback (New Game / remount).
  aiGeneration += 1;
  clearAiTimer();

  const controller: Par55GameController = {
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
function updateUI(controller: Par55GameController): void {
  const { container, state } = controller;
  const previousFocus = captureFocusedCell(container);
  container.innerHTML = '';

  // Main game area
  const gameArea = document.createElement('div');
  gameArea.className = 'par55-game-area';

  // Status bar
  const status = document.createElement('div');
  status.className = `par55-status ${state.currentPlayer}`;
  markStatusLive(status);

  const computerTurn = isComputerTurnPending(controller);

  if (state.winner) {
    status.textContent = `${seatIcon(state.winner)} ${getPlayerName(state.winner)} wins!`;
  } else if (state.winner === null && state.phase === 'gameOver') {
    status.textContent = "It's a tie!";
  } else if (computerTurn) {
    status.classList.add('status-ai-thinking');
    status.textContent = `${seatIcon(state.currentPlayer)} Computer is thinking…`;
  } else if (state.phase === 'selectingBlock') {
    status.textContent = `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)}'s turn — Tap a block from your hand`;
  } else if (state.phase === 'placingBlock') {
    status.textContent = `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)} — Tap a green base to place`;
  }

  gameArea.appendChild(status);

  // Secondary hint when Pass is the only escape.
  if (
    !computerTurn &&
    state.phase === 'selectingBlock' &&
    !hasValidMoves(state)
  ) {
    const hint = document.createElement('div');
    hint.className = 'par55-turn-hint';
    hint.textContent = 'No legal placements — tap Pass Turn';
    gameArea.appendChild(hint);
  }

  // Scores
  gameArea.appendChild(renderScores(state));

  // Winner banner
  if (state.phase === 'gameOver') {
    const banner = document.createElement('div');
    banner.className = 'par55-winner-banner';
    if (state.winner) {
      banner.textContent = `${getPlayerName(state.winner)} Wins! 🎉`;
    } else {
      banner.textContent = "It's a Tie! 🤝";
    }
    gameArea.appendChild(banner);
  }

  // Main layout
  const mainLayout = document.createElement('div');
  mainLayout.className = 'par55-main-layout';
  const inputOpts = { allowInput: !computerTurn };

  // Player 1 hand
  const p1Container = document.createElement('div');
  const p1Label = document.createElement('div');
  p1Label.className = 'par55-hand-label player1';
  p1Label.textContent = `${seatIcon('player1')} Blue (${state.hands.player1.length})`;
  p1Container.appendChild(p1Label);
  p1Container.appendChild(
    renderHand(
      state,
      'player1',
      (blockId) => handleBlockClick(controller, blockId),
      inputOpts
    )
  );

  // Board
  const board = renderBoard(
    state,
    (baseId) => handleBaseClick(controller, baseId),
    inputOpts
  );

  // Player 2 hand
  const p2Container = document.createElement('div');
  const p2Label = document.createElement('div');
  p2Label.className = 'par55-hand-label player2';
  p2Label.textContent = `${seatIcon('player2')} Red (${state.hands.player2.length})`;
  p2Container.appendChild(p2Label);
  p2Container.appendChild(
    renderHand(
      state,
      'player2',
      (blockId) => handleBlockClick(controller, blockId),
      inputOpts
    )
  );

  mainLayout.appendChild(p1Container);
  mainLayout.appendChild(board);
  mainLayout.appendChild(p2Container);

  gameArea.appendChild(mainLayout);

  // Move history
  if (state.moveHistory.length > 0) {
    gameArea.appendChild(renderMoveHistory(state));
  }

  // Controls
  const controls = document.createElement('div');
  controls.className = 'par55-controls';

  if (state.selectedBlock && !computerTurn) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'par55-btn par55-btn-secondary';
    clearBtn.textContent = 'Clear Selection';
    clearBtn.addEventListener('click', () => {
      if (isComputerTurnPending(controller)) return;
      controller.state = clearSelection(state);
      controller.update();
    });
    controls.appendChild(clearBtn);
  }

  if (!hasValidMoves(state) && state.phase !== 'gameOver' && !computerTurn) {
    const passBtn = document.createElement('button');
    passBtn.className = 'par55-btn par55-btn-secondary';
    passBtn.textContent = 'Pass Turn';
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

  // AI turn — single clearable timer (not stacked per rebuild).
  if (
    controller.isAI &&
    controller.aiPlayer === state.currentPlayer &&
    state.phase !== 'gameOver'
  ) {
    scheduleAI(controller, AI_THINK_DELAY_MS);
  }
}

/**
 * Handle block click
 */
function handleBlockClick(
  controller: Par55GameController,
  blockId: string
): void {
  if (isComputerTurnPending(controller)) return;
  controller.state = selectBlock(controller.state, blockId);
  controller.update();
}

/**
 * Handle base click
 */
function handleBaseClick(
  controller: Par55GameController,
  baseId: string
): void {
  if (isComputerTurnPending(controller)) return;
  controller.state = placeBlock(controller.state, baseId);
  controller.update();
}

// =============================================================================
// AI Logic
// =============================================================================

/**
 * Make an AI move using the AI module
 */
function makeAIMove(controller: Par55GameController): void {
  const { state, aiPlayer, aiDifficulty } = controller;

  // Stale timers after New Game / seat flip must not pass or place for Blue.
  if (!isComputerTurnPending(controller)) return;
  if (state.phase === 'gameOver' || !aiPlayer) return;

  // Get AI move using the AI module
  const move = getAIMove(state, aiPlayer, aiDifficulty);

  if (!move) {
    // No valid moves, pass
    controller.state = passTurn(state);
    controller.update();
    return;
  }

  // Execute move
  let newState = selectBlock(state, move.blockId);
  newState = placeBlock(newState, move.baseId);

  controller.state = newState;
  controller.update();
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Create a new game vs human
 */
export function newGameVsHuman(container: HTMLElement): Par55GameController {
  return initGame(container, false);
}

/**
 * Create a new game vs AI
 */
export function newGameVsAI(
  container: HTMLElement,
  difficulty: AIDifficulty = 'medium'
): Par55GameController {
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

  tutorialManager.start(par55Tutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}

/** Cancel pending AI timer and drop mounts (route change / error boundary). */
export function destroyGame(): void {
  aiGeneration += 1;
  clearAiTimer();
  activeContainer = null;
}
