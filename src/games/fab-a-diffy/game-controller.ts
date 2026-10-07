// Fab-a-Diffy Game Controller
// Manages game flow, AI, and UI updates

import { FabADiffyState, Player } from './types';
import { FractionOperation } from '../../core/fractions/types';
import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  executeMove,
  clearSelection,
  passTurn,
  hasAnyValidMove,
} from './rules';
import {
  renderFractionBarPool,
  renderAnswerBoard,
  renderOperationSelector,
  renderScores,
  renderMoveHistory,
  injectFabStyles,
  getPlayerName,
} from './board-ui';
import { applyAIMoveSteps, AIDifficulty } from './ai';
import { disposeFabAiWorker, getAIMoveAsync } from './ai-client';
import { tutorialManager } from '../../core/tutorial';
import { fabADiffyTutorial } from './tutorial';
import { applyGameModeChrome, seatIcon } from '../../ui/player-colors';
import { markStatusLive } from '../../ui/board-a11y';

function syncOpponentChrome(isAI: boolean): void {
  const root = document.getElementById('app');
  if (!root) return;
  applyGameModeChrome(root, isAI ? 'human-vs-ai' : 'human-vs-human');
}

// =============================================================================
// Game Controller
// =============================================================================

export interface FabGameController {
  state: FabADiffyState;
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
 * Invalidates in-flight AI timeouts and worker replies after new game / remount.
 * Bumped when scheduling AI think and on newGame.
 */
let aiGeneration = 0;

function isComputerSeat(controller: FabGameController): boolean {
  return (
    controller.isAI &&
    controller.aiPlayer === controller.state.currentPlayer &&
    !controller.state.winner
  );
}

/**
 * Initialize the game
 */
export function initGame(
  container: HTMLElement,
  vsAI: boolean = false,
  difficulty: AIDifficulty = 'medium'
): FabGameController {
  injectFabStyles();
  activeContainer = container;
  disposeFabAiWorker();
  aiGeneration += 1;

  const controller: FabGameController = {
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
    disposeFabAiWorker();
    aiGeneration += 1;
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
function updateUI(controller: FabGameController): void {
  const { container, state } = controller;
  container.innerHTML = '';

  const humanCanAct = !isComputerSeat(controller);

  // Main game area
  const gameArea = document.createElement('div');
  gameArea.className = 'fab-game-area';

  // Status bar
  const status = document.createElement('div');
  status.className = `fab-status ${state.currentPlayer}`;
  markStatusLive(status);

  if (state.winner) {
    status.textContent = `${seatIcon(state.winner)} ${getPlayerName(state.winner)} wins!`;
  } else if (isComputerSeat(controller)) {
    status.textContent = 'Computer is thinking…';
    status.classList.add('status-ai-thinking');
  } else if (state.phase === 'selectingBar1') {
    status.textContent = `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)}'s turn - Select first fraction bar`;
  } else if (state.phase === 'selectingBar2') {
    status.textContent = `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)}'s turn - Select second fraction bar`;
  } else if (state.phase === 'selectingOperation') {
    status.textContent = `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)}'s turn - Choose an operation`;
  } else if (state.phase === 'confirmingMove') {
    status.textContent = `${seatIcon(state.currentPlayer)} ${getPlayerName(state.currentPlayer)}'s turn - Select matching answer`;
  }

  gameArea.appendChild(status);

  // Scores
  gameArea.appendChild(renderScores(state));

  // Winner banner
  if (state.winner) {
    const banner = document.createElement('div');
    banner.className = 'fab-winner-banner';
    banner.textContent = `${getPlayerName(state.winner)} Wins! 🎉`;
    gameArea.appendChild(banner);
  }

  // Main layout
  const mainLayout = document.createElement('div');
  mainLayout.className = 'fab-main-layout';

  // Left side: fraction bars and operations
  const leftColumn = document.createElement('div');
  leftColumn.className = 'fab-left-column';

  // Fraction bar pool — no selectable chrome while the computer seat acts
  leftColumn.appendChild(
    renderFractionBarPool(state, (barId) => handleBarClick(controller, barId), {
      allowInput: humanCanAct,
    })
  );

  // Operation selector (when two bars selected)
  if (state.selectedBar1 && state.selectedBar2) {
    leftColumn.appendChild(
      renderOperationSelector(
        state,
        (op) => handleOperationSelect(controller, op),
        { allowInput: humanCanAct }
      )
    );
  }

  mainLayout.appendChild(leftColumn);

  // Right side: answer board and history
  const rightColumn = document.createElement('div');
  rightColumn.className = 'fab-right-column';

  rightColumn.appendChild(
    renderAnswerBoard(
      state,
      (answerId) => handleAnswerClick(controller, answerId),
      { allowInput: humanCanAct }
    )
  );

  if (state.moveHistory.length > 0) {
    rightColumn.appendChild(renderMoveHistory(state));
  }

  mainLayout.appendChild(rightColumn);
  gameArea.appendChild(mainLayout);

  // Controls (human seat only — Clear / Pass must not steal the AI turn)
  const controls = document.createElement('div');
  controls.className = 'fab-controls';

  if (humanCanAct && (state.selectedBar1 || state.selectedBar2)) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'fab-btn fab-btn-secondary';
    clearBtn.textContent = 'Clear Selection';
    clearBtn.addEventListener('click', () => {
      if (isComputerSeat(controller)) return;
      controller.state = clearSelection(state);
      controller.update();
    });
    controls.appendChild(clearBtn);
  }

  if (humanCanAct && !hasAnyValidMove(state) && !state.winner) {
    const passBtn = document.createElement('button');
    passBtn.className = 'fab-btn fab-btn-secondary';
    passBtn.textContent = 'Pass Turn';
    passBtn.addEventListener('click', () => {
      if (isComputerSeat(controller)) return;
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

  // AI turn — generation token cancels stacked timeouts from remounts
  if (isComputerSeat(controller)) {
    const gen = ++aiGeneration;
    setTimeout(() => {
      if (gen !== aiGeneration) return;
      makeAIMove(controller, gen);
    }, 800);
  }
}

/**
 * Handle bar click
 */
function handleBarClick(controller: FabGameController, barId: string): void {
  if (isComputerSeat(controller)) return;
  const { state } = controller;

  if (state.phase === 'selectingBar1') {
    controller.state = selectBar1(state, barId);
  } else if (state.phase === 'selectingBar2') {
    controller.state = selectBar2(state, barId);
  }

  controller.update();
}

/**
 * Handle operation selection
 */
function handleOperationSelect(
  controller: FabGameController,
  operation: FractionOperation
): void {
  if (isComputerSeat(controller)) return;
  controller.state = selectOperation(controller.state, operation);
  controller.update();
}

/**
 * Handle answer click
 */
function handleAnswerClick(
  controller: FabGameController,
  answerId: string
): void {
  if (isComputerSeat(controller)) return;
  if (controller.state.phase !== 'confirmingMove') return;

  controller.state = executeMove(controller.state, answerId);
  controller.update();
}

// =============================================================================
// AI Logic
// =============================================================================

/**
 * Make an AI move via worker search + validated applyAIMoveSteps (#12).
 * Async so Hard enumeration stays off the UI thread when Workers exist.
 */
function makeAIMove(controller: FabGameController, scheduledGen: number): void {
  const { state, aiPlayer, aiDifficulty } = controller;

  if (state.winner || !aiPlayer) return;
  if (controller.aiPlayer !== state.currentPlayer) return;
  if (scheduledGen !== aiGeneration) return;

  void (async () => {
    let move;
    try {
      move = await getAIMoveAsync(state, aiPlayer, aiDifficulty);
    } catch {
      move = null;
    }

    if (scheduledGen !== aiGeneration) return;
    if (controller.state !== state) return;

    // Soft-lock recovery: null / failed search passes rather than stalling.
    controller.state = move ? applyAIMoveSteps(state, move) : passTurn(state);
    controller.update();
  })();
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Create a new game vs human
 */
export function newGameVsHuman(container: HTMLElement): FabGameController {
  return initGame(container, false);
}

/**
 * Create a new game vs AI
 */
export function newGameVsAI(
  container: HTMLElement,
  difficulty: AIDifficulty = 'medium'
): FabGameController {
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

  tutorialManager.start(fabADiffyTutorial);
}

// Check if tutorial is active
export function isTutorialActive(): boolean {
  return tutorialManager.getIsActive();
}
