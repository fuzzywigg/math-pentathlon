// Prime Gold Game Controller
// Manages game flow, AI, and UI updates

import { PrimeGoldState, Player } from './types';
import {
  createInitialState,
  rollDice,
  placeChip,
  passTurn,
  hasValidMoves,
  settleIfExhausted,
} from './rules';
import { getAIPlacement, AIDifficulty } from './ai';
import {
  renderBoard,
  renderDice,
  renderExpressions,
  renderScores,
  renderMoveHistory,
  injectPrimeGoldStyles,
  getPlayerName,
} from './board-ui';
import { tutorialManager } from '../../core/tutorial';
import { primeGoldTutorial } from './tutorial';
import { applyGameModeChrome, seatIcon } from '../../ui/player-colors';
import {
  captureFocusedCell,
  restoreGridFocus,
  markStatusLive,
} from '../../ui/board-a11y';
import { isBoard3dEnabled } from '../../core/feature-flags';
import { loadPrimeGoldBoard3DModule } from './board-3d-loader';
import type { PrimeGoldBoard3D } from '../../ui/three/prime-gold-board-3d';

function syncOpponentChrome(isAI: boolean): void {
  const root = document.getElementById('app');
  if (!root) return;
  applyGameModeChrome(root, isAI ? 'human-vs-ai' : 'human-vs-human');
}

// =============================================================================
// Game Controller
// =============================================================================

export interface PrimeGoldController {
  state: PrimeGoldState;
  container: HTMLElement;
  isAI: boolean;
  aiPlayer: Player | null;
  aiDifficulty: AIDifficulty;
  update: () => void;
  newGame: (vsAI: boolean, difficulty?: AIDifficulty) => void;
}

/** Last initialized board container — used by startTutorial. */
let activeContainer: HTMLElement | null = null;
let activeController: PrimeGoldController | null = null;

// Optional Three.js board (only when feature flag is on)
let board3d: PrimeGoldBoard3D | null = null;
let board3dEnabled = false;
let board3dLoading: Promise<void> | null = null;
/** Persistent host for the 3D canvas across UI rebuilds. */
let boardHostEl: HTMLElement | null = null;
/** Single pending AI timer — avoids stacked setTimeouts from every UI rebuild. */
let aiTimer: ReturnType<typeof setTimeout> | null = null;

function clearAiTimer(): void {
  if (aiTimer !== null) {
    clearTimeout(aiTimer);
    aiTimer = null;
  }
}

function scheduleAI(controller: PrimeGoldController, delayMs: number): void {
  clearAiTimer();
  aiTimer = setTimeout(() => {
    aiTimer = null;
    makeAIMove(controller);
  }, delayMs);
}

function unmountBoard3d(): void {
  if (board3d) {
    board3d.unmount();
    board3d = null;
  }
  board3dLoading = null;
  board3dEnabled = false;
  boardHostEl = null;
  clearAiTimer();
}

async function ensureBoard3d(): Promise<void> {
  if (!activeController || board3d || !board3dEnabled) return;
  const host =
    boardHostEl ??
    (activeController.container.querySelector(
      '.pg-board-host'
    ) as HTMLElement | null);
  if (!host) return;
  boardHostEl = host;
  try {
    const mod = await loadPrimeGoldBoard3DModule();
    if (!activeController || !board3dEnabled) return;
    const liveHost =
      boardHostEl ??
      (activeController.container.querySelector(
        '.pg-board-host'
      ) as HTMLElement | null);
    if (!liveHost) return;
    boardHostEl = liveHost;
    board3d = await mod.createPrimeGoldBoard3D(liveHost, (value, expr) => {
      if (activeController) handlePlacement(activeController, value, expr);
    });
  } catch {
    // WebGL unavailable or renderer failed — stay on 2D board.
    board3d = null;
    board3dEnabled = false;
  }
}

/**
 * Initialize the game
 */
export function initGame(
  container: HTMLElement,
  vsAI: boolean = false,
  difficulty: AIDifficulty = 'medium'
): PrimeGoldController {
  unmountBoard3d();
  injectPrimeGoldStyles();
  activeContainer = container;

  const controller: PrimeGoldController = {
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
  controller.newGame = (vsAI: boolean, diff?: AIDifficulty) => {
    controller.state = createInitialState();
    controller.isAI = vsAI;
    controller.aiPlayer = vsAI ? 'player2' : null;
    controller.aiDifficulty = diff || controller.aiDifficulty;
    syncOpponentChrome(vsAI);
    controller.update();
  };

  syncOpponentChrome(vsAI);
  // Build chrome + board host first so ensureBoard3d has a mount point.
  controller.update();

  if (board3dEnabled) {
    board3dLoading = ensureBoard3d().then(() => {
      if (activeController) activeController.update();
    });
  }

  if (import.meta.env.DEV) {
    (
      window as Window & {
        __mpPrimeGoldTest?: {
          getState: () => PrimeGoldState;
          setState: (state: PrimeGoldState) => void;
        };
      }
    ).__mpPrimeGoldTest = {
      getState: () => controller.state,
      setState: (state: PrimeGoldState) => {
        controller.state = state;
        controller.update();
      },
    };
  }

  return controller;
}

/**
 * Skip seats that are out of chips, and settle board-full / both-out soft-locks.
 * Returns true when state changed (caller should re-enter updateUI once).
 */
function applyForcedTurnAdvances(controller: PrimeGoldController): boolean {
  let changed = false;
  for (let guard = 0; guard < 4; guard++) {
    let { state } = controller;
    if (state.phase === 'gameOver') break;

    const settled = settleIfExhausted(state);
    if (settled !== state) {
      controller.state = settled;
      changed = true;
      break;
    }

    if (
      (state.phase === 'rolling' || state.phase === 'placing') &&
      state.playerChips[state.currentPlayer] <= 0
    ) {
      controller.state = passTurn(state);
      changed = true;
      continue;
    }
    break;
  }
  return changed;
}

/**
 * Update the UI
 */
function updateUI(controller: PrimeGoldController): void {
  // Out-of-chips seats must not sit on "Roll the dice" forever.
  if (applyForcedTurnAdvances(controller)) {
    updateUI(controller);
    return;
  }

  const { container, state } = controller;
  const previousFocus = captureFocusedCell(container);

  // Detach persistent 3D host so a chrome rebuild does not dispose WebGL.
  const existingHost = container.querySelector(
    '.pg-board-host'
  ) as HTMLElement | null;
  if (existingHost) {
    existingHost.remove();
    boardHostEl = existingHost;
  }

  container.replaceChildren();

  // Main game area
  const gameArea = document.createElement('div');
  gameArea.className = 'pg-game-area';

  // Status bar
  const status = document.createElement('div');
  status.className = `pg-status ${state.currentPlayer}`;
  markStatusLive(status);

  const aiThinking = isComputerTurnPending(controller);
  const inputOpts = { allowInput: !aiThinking };

  if (state.winner) {
    status.textContent = `${seatIcon(state.winner)} ${getPlayerName(state.winner)} wins with ${state.primeVeins[state.winner]} prime veins!`;
  } else if (state.winner === null && state.phase === 'gameOver') {
    status.textContent = "It's a tie!";
  } else if (aiThinking) {
    status.classList.add('status-ai-thinking');
    status.textContent = `${seatIcon(state.currentPlayer)} Computer is thinking…`;
  } else if (state.phase === 'rolling') {
    status.textContent = `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)}'s turn - Roll the dice`;
  } else if (state.phase === 'placing') {
    status.textContent = `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)} - Select a number to place`;
  }

  gameArea.appendChild(status);

  // Scores
  gameArea.appendChild(renderScores(state));

  // Winner banner
  if (state.phase === 'gameOver') {
    const banner = document.createElement('div');
    banner.className = 'pg-winner-banner';
    if (state.winner) {
      banner.textContent = `${getPlayerName(state.winner)} Wins!`;
    } else {
      banner.textContent = "It's a Tie!";
    }
    gameArea.appendChild(banner);
  }

  // Main layout
  const mainLayout = document.createElement('div');
  mainLayout.className = 'pg-main-layout';

  // Dice area — hide Roll while the computer seat thinks
  mainLayout.appendChild(
    renderDice(state, () => handleRoll(controller), inputOpts)
  );

  const allowBoardClicks = !aiThinking && state.phase === 'placing';

  if (board3dEnabled) {
    const host = boardHostEl ?? document.createElement('div');
    host.className = 'pg-board-host';
    boardHostEl = host;
    mainLayout.appendChild(host);
    if (board3d) {
      board3d.update(
        state,
        allowBoardClicks
          ? (value, expr) => handlePlacement(controller, value, expr)
          : undefined
      );
    }
  } else {
    mainLayout.appendChild(
      renderBoard(
        state,
        (value, expr) => handlePlacement(controller, value, expr),
        inputOpts
      )
    );
  }

  // Expressions list (when placing) — thinking chrome only on AI seat
  if (state.phase === 'placing') {
    mainLayout.appendChild(
      renderExpressions(
        state,
        (value, expr) => handlePlacement(controller, value, expr),
        inputOpts
      )
    );
  }

  // Move history
  if (state.moveHistory.length > 0) {
    mainLayout.appendChild(renderMoveHistory(state));
  }

  gameArea.appendChild(mainLayout);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'pg-controls';

  if (!aiThinking && state.phase === 'placing' && !hasValidMoves(state)) {
    const passBtn = document.createElement('button');
    passBtn.className = 'pg-btn pg-btn-secondary';
    passBtn.textContent = 'Pass Turn';
    passBtn.addEventListener('click', () => handlePass(controller));
    controls.appendChild(passBtn);
  }

  // New Game lives only in shared header chrome (#new-game-btn + modal)
  if (controls.childElementCount > 0) {
    gameArea.appendChild(controls);
  }
  container.appendChild(gameArea);
  restoreGridFocus(container, previousFocus);

  // AI turn — schedule once; re-entry must not reset the think timer forever.
  if (aiThinking && aiTimer === null) {
    scheduleAI(controller, 800);
  }
}

function isComputerTurnPending(controller: PrimeGoldController): boolean {
  return (
    controller.isAI &&
    controller.aiPlayer === controller.state.currentPlayer &&
    controller.state.phase !== 'gameOver'
  );
}

/**
 * Handle dice roll
 */
function handleRoll(controller: PrimeGoldController): void {
  if (isComputerTurnPending(controller)) return;
  controller.state = rollDice(controller.state);
  controller.update();
}

/**
 * Handle chip placement
 */
function handlePlacement(
  controller: PrimeGoldController,
  value: number,
  expr: string
): void {
  if (isComputerTurnPending(controller)) return;
  controller.state = placeChip(controller.state, value, expr);
  controller.update();
}

/**
 * Handle pass when no placements remain (human seat only).
 */
function handlePass(controller: PrimeGoldController): void {
  if (isComputerTurnPending(controller)) return;
  if (controller.state.phase !== 'placing') return;
  controller.state = passTurn(controller.state);
  controller.update();
}

// =============================================================================
// AI Logic
// =============================================================================

/**
 * Make an AI move using the AI module
 */
function makeAIMove(controller: PrimeGoldController): void {
  const { aiPlayer, aiDifficulty } = controller;

  if (controller.state.phase === 'gameOver' || !aiPlayer) return;
  // Guard against stale timers after destroy / new game
  if (activeController !== controller) return;

  // Out of chips or board already settled — advance without rolling forever.
  if (applyForcedTurnAdvances(controller)) {
    controller.update();
    return;
  }

  // Roll dice if needed
  if (controller.state.phase === 'rolling') {
    controller.state = rollDice(controller.state);
    // Place on the next tick without going through updateUI's 800ms reschedule.
    clearAiTimer();
    controller.update();
    // updateUI schedules 800ms; replace with a shorter post-roll delay.
    scheduleAI(controller, 600);
    return;
  }

  // Find best placement using AI module
  if (controller.state.phase === 'placing') {
    const placement = getAIPlacement(
      controller.state,
      aiPlayer,
      aiDifficulty
    );

    if (!placement) {
      controller.state = passTurn(controller.state);
      controller.update();
      return;
    }

    controller.state = placeChip(
      controller.state,
      placement.value,
      placement.expression
    );
    controller.update();
  }
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Create a new game vs human
 */
export function newGameVsHuman(container: HTMLElement): PrimeGoldController {
  return initGame(container, false);
}

/**
 * Create a new game vs AI
 */
export function newGameVsAI(
  container: HTMLElement,
  difficulty: AIDifficulty = 'medium'
): PrimeGoldController {
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

  tutorialManager.start(primeGoldTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}

/** Dispose 3D resources and clear controller mounts (route change). */
export function destroyGame(): void {
  unmountBoard3d();
  activeController = null;
  activeContainer = null;
  if (import.meta.env.DEV) {
    delete (window as Window & { __mpPrimeGoldTest?: unknown })
      .__mpPrimeGoldTest;
  }
}

/** Whether the live controller is using the 3D board path. */
export function isUsingBoard3d(): boolean {
  return board3dEnabled && board3d !== null;
}

/** Await pending 3D mount (tests / callers that need the canvas ready). */
export function whenBoard3dReady(): Promise<void> {
  return board3dLoading ?? Promise.resolve();
}

/** Current controller state (tests). */
export function getGameState(): PrimeGoldState | null {
  return activeController?.state ?? null;
}
