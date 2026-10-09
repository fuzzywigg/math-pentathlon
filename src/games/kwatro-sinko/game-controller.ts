// Kwatro-Sinko Game Controller
// Manages game flow, AI, and UI updates

import type { KwaState, Player } from './types';
import {
  createInitialState,
  selectChip,
  clearSelection,
  moveChip,
  passTurn,
  hasValidMoves,
} from './rules';
import type { AIDifficulty } from './ai';
import { getAIMove, isAITurn } from './ai';
import {
  renderBoard,
  renderChipInfo,
  renderMoveHistory,
  injectKwaStyles,
  getPlayerName,
} from './board-ui';
import { tutorialManager } from '../../core/tutorial';
import { kwatroSinkoTutorial } from './tutorial';
import { seatIcon, syncAppOpponentChrome } from '../../ui/player-colors';
import { clearNullableTimeout } from '../../ui/timeout-handle';
import {
  captureFocusedCell,
  restoreGridFocus,
  markStatusLive,
} from '../../ui/board-a11y';
import { isBoard3dEnabled } from '../../core/feature-flags';
import {
  markBoard3dWebGlFallback,
  clearBoard3dWebGlFallback,
} from '../../ui/three/tablet-gl';
import { loadKwatroSinkoBoard3DModule } from './board-3d-loader';
import type { KwatroSinkoBoard3D } from '../../ui/three/kwatro-sinko-board-3d';

import { clearElement } from '../../core/dom-security';

function syncOpponentChrome(isAI: boolean): void {
  syncAppOpponentChrome(isAI);
}

// =============================================================================
// Game Controller
// =============================================================================

export interface KwaGameController {
  state: KwaState;
  container: HTMLElement;
  isAI: boolean;
  aiPlayer: Player | null;
  aiDifficulty: AIDifficulty;
  update: () => void;
  newGame: (vsAI: boolean, difficulty?: AIDifficulty) => void;
}

/** Last initialized board container — used by startTutorial. */
let activeContainer: HTMLElement | null = null;
let activeController: KwaGameController | null = null;

// Optional Three.js board (only when feature flag is on)
let board3d: KwatroSinkoBoard3D | null = null;
let board3dEnabled = false;
let board3dLoading: Promise<void> | null = null;
let board3dHost: HTMLElement | null = null;
/** Bumped to invalidate in-flight 3D mounts after destroy / remount. */
let board3dMountGen = 0;

/** Single pending AI timer — avoids stacked setTimeouts from UI rebuilds. */
let aiTimer: ReturnType<typeof setTimeout> | null = null;

function clearAiTimer(): void {
  aiTimer = clearNullableTimeout(aiTimer);
}

/** True while it is the computer's seat (including the 800ms think pause). */
function isComputerTurnPending(controller: KwaGameController): boolean {
  return isAITurn(
    controller.state,
    controller.aiPlayer,
    controller.isAI ? 'human-vs-ai' : 'human-vs-human'
  );
}

function unmountBoard3d(): void {
  board3dMountGen += 1;
  if (board3dHost) {
    board3dHost.removeEventListener('mp3d-context-lost', onBoard3dContextLost);
  }
  if (board3d) {
    board3d.unmount();
    board3d = null;
  }
  board3dLoading = null;
  board3dEnabled = false;
  board3dHost = null;
}

function onBoard3dContextLost(): void {
  if (board3dHost) {
    board3dHost.removeEventListener('mp3d-context-lost', onBoard3dContextLost);
  }
  // Board already tore itself down via webglcontextlost → tearDown.
  board3d = null;
  markBoard3dWebGlFallback(board3dHost, 'context-lost');
  board3dEnabled = false;
  board3dLoading = null;
  if (activeController) {
    activeController.update();
  }
}

async function ensureBoard3d(controller: KwaGameController): Promise<void> {
  if (!board3dHost || board3d || !board3dEnabled) {
    return;
  }
  const mountGen = board3dMountGen;
  try {
    const mod = await loadKwatroSinkoBoard3DModule();
    if (
      mountGen !== board3dMountGen ||
      !board3dHost ||
      !board3dEnabled ||
      activeController !== controller
    ) {
      return;
    }
    const instance = await mod.createKwatroSinkoBoard3D(
      board3dHost,
      (nodeId) => handleNodeClick(controller, nodeId),
      (chipId) => handleChipClick(controller, chipId)
    );
    // Awaited Three.js create — discard if a newer mount/destroy won the race.
    if (
      mountGen !== board3dMountGen ||
      !board3dEnabled ||
      activeController !== controller
    ) {
      instance.unmount();
      return;
    }
    board3d = instance;
    clearBoard3dWebGlFallback(board3dHost);
    board3dHost.addEventListener('mp3d-context-lost', onBoard3dContextLost);
  } catch {
    // WebGL unavailable or renderer failed — stay on 2D SVG.
    markBoard3dWebGlFallback(board3dHost, 'webgl-unavailable');
    if (mountGen === board3dMountGen) {
      board3d = null;
      board3dEnabled = false;
      board3dHost = null;
    }
  }
}

/**
 * Initialize the game
 */
export function initGame(
  container: HTMLElement,
  vsAI: boolean = false,
  difficulty: AIDifficulty = 'medium'
): KwaGameController {
  injectKwaStyles();
  clearAiTimer();
  unmountBoard3d();
  activeContainer = container;

  const controller: KwaGameController = {
    state: createInitialState(),
    container,
    isAI: vsAI,
    aiPlayer: vsAI ? 'player2' : null,
    aiDifficulty: difficulty,
    update: () => {},
    newGame: () => {},
  };

  activeController = controller;
  board3dEnabled = isBoard3dEnabled();

  controller.update = () => updateUI(controller);
  controller.newGame = (nextVsAI: boolean, diff?: AIDifficulty) => {
    clearAiTimer();
    controller.state = createInitialState();
    controller.isAI = nextVsAI;
    controller.aiPlayer = nextVsAI ? 'player2' : null;
    controller.aiDifficulty = diff || controller.aiDifficulty;
    syncOpponentChrome(nextVsAI);
    controller.update();
  };

  syncOpponentChrome(vsAI);

  if (board3dEnabled) {
    // Build chrome + stable board host first, then mount Three.js.
    // While `board3d` is null the host stays empty (no nested 2D `.kwa-board`).
    controller.update();
    board3dLoading = ensureBoard3d(controller).then(() => {
      if (activeController === controller) {
        controller.update();
      }
    });
  } else {
    controller.update();
  }

  return controller;
}

/**
 * Update the UI (2D path preserves exact prior DOM when board3d is off).
 */
function updateUI(controller: KwaGameController): void {
  const { container, state } = controller;

  if (board3dEnabled) {
    updateUI3d(controller);
    maybeRunAI(controller);
    return;
  }

  const previousFocus = captureFocusedCell(container);
  clearElement(container);

  // Main game area
  const gameArea = document.createElement('div');
  gameArea.className = 'kwa-game-area';

  // Status bar
  const status = document.createElement('div');
  status.className = `kwa-status ${state.currentPlayer}`;
  markStatusLive(status);

  if (state.winner) {
    status.textContent = `${seatIcon(state.winner)} ${getPlayerName(state.winner)} wins!`;
  } else if (state.phase === 'selectingChip') {
    status.textContent = `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)}'s turn - Select a chip to move`;
  } else if (state.phase === 'selectingDest') {
    status.textContent = `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)} - Click a green space to move`;
  }

  gameArea.appendChild(status);

  // Chip info
  gameArea.appendChild(renderChipInfo(state));

  // Target info
  const targetInfo = document.createElement('div');
  targetInfo.className = 'kwa-target-info';
  // trusted constant markup
  targetInfo.innerHTML =
    'Create an alignment where: <strong>a + b - c = 4 or 5</strong>';
  gameArea.appendChild(targetInfo);

  // Winner banner
  if (state.winner) {
    const banner = document.createElement('div');
    banner.className = 'kwa-winner-banner';
    banner.textContent = `${getPlayerName(state.winner)} Wins! 🎉`;
    gameArea.appendChild(banner);

    if (state.winningAlignment) {
      const exprEl = document.createElement('div');
      exprEl.className = 'kwa-winning-expr';
      exprEl.textContent = state.winningAlignment.expression;
      gameArea.appendChild(exprEl);
    }
  }

  // Main layout
  const mainLayout = document.createElement('div');
  mainLayout.className = 'kwa-main-layout';

  // Board
  const board = renderBoard(
    state,
    (nodeId) => handleNodeClick(controller, nodeId),
    (chipId) => handleChipClick(controller, chipId),
    { allowInput: !isComputerTurnPending(controller) }
  );

  mainLayout.appendChild(board);

  // Move history
  if (state.moveHistory.length > 0) {
    mainLayout.appendChild(renderMoveHistory(state));
  }

  gameArea.appendChild(mainLayout);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'kwa-controls';

  if (state.selectedChip && !isComputerTurnPending(controller)) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'kwa-btn kwa-btn-secondary';
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

  if (
    !hasValidMoves(state) &&
    state.phase !== 'gameOver' &&
    !isComputerTurnPending(controller)
  ) {
    const passBtn = document.createElement('button');
    passBtn.className = 'kwa-btn kwa-btn-secondary';
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

  maybeRunAI(controller);
}

/**
 * 3D path: rebuild chrome around a preserved board host so WebGL survives.
 */
function updateUI3d(controller: KwaGameController): void {
  const { container, state } = controller;
  const previousFocus = captureFocusedCell(container);

  // Detach stable board host (keeps canvas alive across chrome rebuilds)
  const preservedHost = board3dHost;
  if (preservedHost?.parentElement) {
    preservedHost.parentElement.removeChild(preservedHost);
  }

  container.replaceChildren();

  const gameArea = document.createElement('div');
  gameArea.className = 'kwa-game-area';

  const status = document.createElement('div');
  status.className = `kwa-status ${state.currentPlayer}`;
  markStatusLive(status);

  if (state.winner) {
    status.textContent = `${seatIcon(state.winner)} ${getPlayerName(state.winner)} wins!`;
  } else if (state.phase === 'selectingChip') {
    status.textContent = `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)}'s turn - Select a chip to move`;
  } else if (state.phase === 'selectingDest') {
    status.textContent = `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)} - Click a green space to move`;
  }

  gameArea.appendChild(status);
  gameArea.appendChild(renderChipInfo(state));

  const targetInfo = document.createElement('div');
  targetInfo.className = 'kwa-target-info';
  // trusted constant markup
  targetInfo.innerHTML =
    'Create an alignment where: <strong>a + b - c = 4 or 5</strong>';
  gameArea.appendChild(targetInfo);

  if (state.winner) {
    const banner = document.createElement('div');
    banner.className = 'kwa-winner-banner';
    banner.textContent = `${getPlayerName(state.winner)} Wins!`;
    gameArea.appendChild(banner);

    if (state.winningAlignment) {
      const exprEl = document.createElement('div');
      exprEl.className = 'kwa-winning-expr';
      exprEl.textContent = state.winningAlignment.expression;
      gameArea.appendChild(exprEl);
    }
  }

  const mainLayout = document.createElement('div');
  mainLayout.className = 'kwa-main-layout';

  if (!board3dHost) {
    board3dHost = document.createElement('div');
    // Include `.kwa-board` so tutorial highlightSelector keeps working in 3D.
    board3dHost.className = 'kwa-board kwa-board-3d-slot';
  }
  mainLayout.appendChild(board3dHost);

  // Match Queens/FIAR: while 3D is enabled, never nest a classic `.kwa-board`
  // SVG inside the host (duplicate mount locators break smoke). Loading leaves
  // the host empty; context-loss flips board3dEnabled off and uses the 2D path.
  if (board3d) {
    const allowInput = !isComputerTurnPending(controller);
    board3d.update(
      state,
      allowInput ? (nodeId) => handleNodeClick(controller, nodeId) : undefined,
      allowInput ? (chipId) => handleChipClick(controller, chipId) : undefined
    );
  } else {
    board3dHost.replaceChildren();
  }

  if (state.moveHistory.length > 0) {
    mainLayout.appendChild(renderMoveHistory(state));
  }

  gameArea.appendChild(mainLayout);

  const controls = document.createElement('div');
  controls.className = 'kwa-controls';

  if (state.selectedChip && !isComputerTurnPending(controller)) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'kwa-btn kwa-btn-secondary';
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

  if (
    !hasValidMoves(state) &&
    state.phase !== 'gameOver' &&
    !isComputerTurnPending(controller)
  ) {
    const passBtn = document.createElement('button');
    passBtn.className = 'kwa-btn kwa-btn-secondary';
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

  if (controls.childElementCount > 0) {
    gameArea.appendChild(controls);
  }
  container.appendChild(gameArea);
  restoreGridFocus(container, previousFocus);

  // Re-attach preserved host reference if we created a fresh one earlier this frame
  void preservedHost;
}

function maybeRunAI(controller: KwaGameController): void {
  const { state } = controller;
  if (
    !controller.isAI ||
    !controller.aiPlayer ||
    controller.aiPlayer !== state.currentPlayer ||
    state.phase === 'gameOver'
  ) {
    return;
  }
  // Already waiting on a computer turn — do not stack another timeout
  // (e.g. ensureBoard3d().then → update after a human move already scheduled AI).
  if (aiTimer !== null) {
    return;
  }

  aiTimer = setTimeout(() => {
    aiTimer = null;
    makeAIMove(controller);
  }, 800);
}

/**
 * Handle chip click
 */
function handleChipClick(controller: KwaGameController, chipId: string): void {
  if (isComputerTurnPending(controller)) {
    return;
  }

  // Deselect when clicking the already-selected chip
  if (
    controller.state.phase === 'selectingDest' &&
    controller.state.selectedChip === chipId
  ) {
    controller.state = clearSelection(controller.state);
    controller.update();
    return;
  }
  controller.state = selectChip(controller.state, chipId);
  controller.update();
}

/**
 * Handle node click
 */
function handleNodeClick(controller: KwaGameController, nodeId: string): void {
  if (isComputerTurnPending(controller)) {
    return;
  }

  // If clicking a chip-occupied node during select, treat as chip select
  const node = controller.state.nodes.get(nodeId);
  if (
    node?.chip &&
    controller.state.phase === 'selectingChip' &&
    node.chip.owner === controller.state.currentPlayer
  ) {
    handleChipClick(controller, node.chip.id);
    return;
  }
  controller.state = moveChip(controller.state, nodeId);
  controller.update();
}

// =============================================================================
// AI Logic
// =============================================================================

/**
 * Make an AI move using the AI module
 */
function makeAIMove(controller: KwaGameController): void {
  const { state, aiPlayer, aiDifficulty } = controller;

  if (state.phase === 'gameOver' || !aiPlayer) {
    return;
  }
  if (activeController !== controller) {
    return;
  }
  // Stale timer after a prior AI move / human turn — never pass or move for them.
  if (state.currentPlayer !== aiPlayer) {
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
  let newState = selectChip(state, move.chipId);
  newState = moveChip(newState, move.nodeId);

  controller.state = newState;
  controller.update();
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Create a new game vs human
 */
export function newGameVsHuman(container: HTMLElement): KwaGameController {
  return initGame(container, false);
}

/**
 * Create a new game vs AI
 */
export function newGameVsAI(
  container: HTMLElement,
  difficulty: AIDifficulty = 'medium'
): KwaGameController {
  return initGame(container, true, difficulty);
}

export function destroyGame(): void {
  clearAiTimer();
  unmountBoard3d();
  activeContainer = null;
  activeController = null;
}

export function isUsingBoard3d(): boolean {
  return board3dEnabled && board3d !== null;
}

export function whenBoard3dReady(): Promise<void> {
  return board3dLoading ?? Promise.resolve();
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

  tutorialManager.start(kwatroSinkoTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}
