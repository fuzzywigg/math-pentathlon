// Par 55 Game Controller
// Manages game flow, AI, and UI updates

import type { Par55State, Player } from './types';
import {
  createInitialState,
  selectBlock,
  clearSelection,
  placeBlock,
  passTurn,
  hasValidMoves,
} from './rules';
import type { AIDifficulty } from './ai';
import { getAIMove, isAITurn } from './ai';
import {
  renderBoard,
  syncBoard,
  renderHand,
  renderScores,
  renderMoveHistory,
  injectPar55Styles,
  getPlayerName,
} from './board-ui';
import { tutorialManager } from '../../core/tutorial';
import { clearElement } from '../../core/dom-security';
import { par55Tutorial } from './tutorial';
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
): Par55GameController {
  injectPar55Styles();
  activeContainer = container;

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

function statusTextFor(
  controller: Par55GameController,
  computerTurn: boolean
): string {
  const { state } = controller;
  if (state.winner) {
    return `${seatIcon(state.winner)} ${getPlayerName(state.winner)} wins!`;
  }
  if (state.winner === null && state.phase === 'gameOver') {
    return "It's a tie!";
  }
  if (computerTurn) {
    return `${seatIcon(state.currentPlayer)} Computer is thinking…`;
  }
  if (state.phase === 'selectingBlock') {
    return `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)}'s turn - Select a block`;
  }
  if (state.phase === 'placingBlock') {
    return `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)} - Place block on a green base`;
  }
  return '';
}

function buildHandColumn(
  controller: Par55GameController,
  player: Player,
  inputOpts: { allowInput: boolean }
): HTMLElement {
  const { state } = controller;
  const column = document.createElement('div');
  column.className = `par55-hand-column par55-hand-column-${player}`;
  const label = document.createElement('div');
  label.className = `par55-hand-label ${player}`;
  const name = player === 'player1' ? 'Blue' : 'Red';
  label.textContent = `${seatIcon(player)} ${name} (${state.hands[player].length})`;
  column.appendChild(label);
  column.appendChild(
    renderHand(
      state,
      player,
      (blockId) => handleBlockClick(controller, blockId),
      inputOpts
    )
  );
  return column;
}

function buildControls(
  controller: Par55GameController,
  computerTurn: boolean
): HTMLElement | null {
  const { state } = controller;
  const controls = document.createElement('div');
  controls.className = 'par55-controls';

  if (state.selectedBlock && !computerTurn) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'par55-btn par55-btn-secondary';
    clearBtn.textContent = 'Clear Selection';
    clearBtn.addEventListener('click', () => {
      if (isComputerTurnPending(controller)) {
        return;
      }
      controller.state = clearSelection(controller.state);
      controller.update();
    });
    controls.appendChild(clearBtn);
  }

  if (
    !hasValidMoves(state) &&
    state.phase !== 'gameOver' &&
    !computerTurn
  ) {
    const passBtn = document.createElement('button');
    passBtn.className = 'par55-btn par55-btn-secondary';
    passBtn.textContent = 'Pass Turn';
    passBtn.addEventListener('click', () => {
      if (isComputerTurnPending(controller)) {
        return;
      }
      controller.state = passTurn(controller.state);
      controller.update();
    });
    controls.appendChild(passBtn);
  }

  // New Game lives only in shared header chrome (#new-game-btn + modal)
  return controls.childElementCount > 0 ? controls : null;
}

function fillChromeAroundBoard(
  gameArea: HTMLElement,
  controller: Par55GameController,
  board: HTMLElement,
  computerTurn: boolean
): void {
  const { state } = controller;
  const inputOpts = { allowInput: !computerTurn };

  const status = document.createElement('div');
  status.className = `par55-status ${state.currentPlayer}`;
  if (computerTurn) {
    status.classList.add('status-ai-thinking');
  }
  markStatusLive(status);
  status.textContent = statusTextFor(controller, computerTurn);
  gameArea.appendChild(status);
  gameArea.appendChild(renderScores(state));

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

  const mainLayout = document.createElement('div');
  mainLayout.className = 'par55-main-layout';
  mainLayout.appendChild(buildHandColumn(controller, 'player1', inputOpts));
  mainLayout.appendChild(board);
  mainLayout.appendChild(buildHandColumn(controller, 'player2', inputOpts));
  gameArea.appendChild(mainLayout);

  if (state.moveHistory.length > 0) {
    gameArea.appendChild(renderMoveHistory(state));
  }

  const controls = buildControls(controller, computerTurn);
  if (controls) {
    gameArea.appendChild(controls);
  }
}

function syncChromeAroundBoard(
  gameArea: HTMLElement,
  controller: Par55GameController,
  board: HTMLElement,
  computerTurn: boolean
): void {
  const { state } = controller;
  const inputOpts = { allowInput: !computerTurn };

  const status = gameArea.querySelector('.par55-status') as HTMLElement | null;
  if (status) {
    status.className = `par55-status ${state.currentPlayer}`;
    if (computerTurn) {
      status.classList.add('status-ai-thinking');
    }
    status.textContent = statusTextFor(controller, computerTurn);
  }

  gameArea.querySelector('.par55-scores')?.replaceWith(renderScores(state));

  const mainLayout = gameArea.querySelector('.par55-main-layout');
  if (mainLayout) {
    mainLayout
      .querySelector('.par55-hand-column-player1')
      ?.replaceWith(buildHandColumn(controller, 'player1', inputOpts));
    mainLayout
      .querySelector('.par55-hand-column-player2')
      ?.replaceWith(buildHandColumn(controller, 'player2', inputOpts));
    // Keep the persistent board node in the middle.
    if (!mainLayout.contains(board)) {
      const p2 = mainLayout.querySelector('.par55-hand-column-player2');
      if (p2) {
        mainLayout.insertBefore(board, p2);
      } else {
        mainLayout.appendChild(board);
      }
    }
  }

  gameArea.querySelector('.par55-history')?.remove();
  if (state.moveHistory.length > 0) {
    const controlsEl = gameArea.querySelector('.par55-controls');
    const history = renderMoveHistory(state);
    if (controlsEl) {
      gameArea.insertBefore(history, controlsEl);
    } else {
      gameArea.appendChild(history);
    }
  }

  gameArea.querySelector('.par55-controls')?.remove();
  const controls = buildControls(controller, computerTurn);
  if (controls) {
    gameArea.appendChild(controls);
  }

  syncBoard(
    board,
    state,
    (baseId) => handleBaseClick(controller, baseId),
    inputOpts
  );
}

/**
 * Update the UI
 */
function updateUI(controller: Par55GameController): void {
  // Drop paints after destroyGame nulled the mount ref (remount safety).
  if (!activeContainer || controller.container !== activeContainer) {
    return;
  }

  const { container, state } = controller;
  const previousFocus = captureFocusedCell(container);
  const computerTurn = isComputerTurnPending(controller);

  const existingArea = container.querySelector(
    '.par55-game-area'
  ) as HTMLElement | null;
  const existingBoard = existingArea?.querySelector(
    '.par55-board'
  ) as HTMLElement | null;
  const wasGameOver = Boolean(
    existingArea?.querySelector('.par55-winner-banner')
  );
  const canReuseBoard =
    Boolean(existingArea) &&
    Boolean(existingBoard) &&
    !wasGameOver &&
    state.phase !== 'gameOver';

  if (!canReuseBoard) {
    clearElement(container);
    const gameArea = document.createElement('div');
    gameArea.className = 'par55-game-area';
    const board = renderBoard(
      state,
      (baseId) => handleBaseClick(controller, baseId),
      { allowInput: !computerTurn }
    );
    fillChromeAroundBoard(gameArea, controller, board, computerTurn);
    container.appendChild(gameArea);
  } else if (existingArea && existingBoard) {
    syncChromeAroundBoard(
      existingArea,
      controller,
      existingBoard,
      computerTurn
    );
  }

  restoreGridFocus(container, previousFocus);

  // AI turn
  if (
    controller.isAI &&
    controller.aiPlayer === state.currentPlayer &&
    state.phase !== 'gameOver'
  ) {
    scheduleAI(() => makeAIMove(controller), 800);
  }
}

/**
 * Handle block click
 */
function handleBlockClick(
  controller: Par55GameController,
  blockId: string
): void {
  if (isComputerTurnPending(controller)) {
    return;
  }
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
  if (isComputerTurnPending(controller)) {
    return;
  }
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

  tutorialManager.start(par55Tutorial);
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
