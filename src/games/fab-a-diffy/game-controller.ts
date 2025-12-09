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
import { getAIMove, AIDifficulty } from './ai';

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

/**
 * Initialize the game
 */
export function initGame(container: HTMLElement, vsAI: boolean = false, difficulty: AIDifficulty = 'medium'): FabGameController {
  injectFabStyles();

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
function updateUI(controller: FabGameController): void {
  const { container, state } = controller;
  container.innerHTML = '';

  // Main game area
  const gameArea = document.createElement('div');
  gameArea.className = 'fab-game-area';

  // Status bar
  const status = document.createElement('div');
  status.className = `fab-status ${state.currentPlayer}`;

  if (state.winner) {
    status.textContent = `${getPlayerName(state.winner)} wins!`;
  } else if (state.phase === 'selectingBar1') {
    status.textContent = `${getPlayerName(state.currentPlayer)}'s turn - Select first fraction bar`;
  } else if (state.phase === 'selectingBar2') {
    status.textContent = `${getPlayerName(state.currentPlayer)}'s turn - Select second fraction bar`;
  } else if (state.phase === 'selectingOperation') {
    status.textContent = `${getPlayerName(state.currentPlayer)}'s turn - Choose an operation`;
  } else if (state.phase === 'confirmingMove') {
    status.textContent = `${getPlayerName(state.currentPlayer)}'s turn - Select matching answer`;
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

  // Fraction bar pool
  leftColumn.appendChild(
    renderFractionBarPool(state, (barId) => handleBarClick(controller, barId))
  );

  // Operation selector (when two bars selected)
  if (state.selectedBar1 && state.selectedBar2) {
    leftColumn.appendChild(
      renderOperationSelector(state, (op) => handleOperationSelect(controller, op))
    );
  }

  mainLayout.appendChild(leftColumn);

  // Right side: answer board and history
  const rightColumn = document.createElement('div');
  rightColumn.className = 'fab-right-column';

  rightColumn.appendChild(
    renderAnswerBoard(state, (answerId) => handleAnswerClick(controller, answerId))
  );

  if (state.moveHistory.length > 0) {
    rightColumn.appendChild(renderMoveHistory(state));
  }

  mainLayout.appendChild(rightColumn);
  gameArea.appendChild(mainLayout);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'fab-controls';

  if (state.selectedBar1 || state.selectedBar2) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'fab-btn fab-btn-secondary';
    clearBtn.textContent = 'Clear Selection';
    clearBtn.addEventListener('click', () => {
      controller.state = clearSelection(state);
      controller.update();
    });
    controls.appendChild(clearBtn);
  }

  if (!hasAnyValidMove(state) && !state.winner) {
    const passBtn = document.createElement('button');
    passBtn.className = 'fab-btn fab-btn-secondary';
    passBtn.textContent = 'Pass Turn';
    passBtn.addEventListener('click', () => {
      controller.state = passTurn(state);
      controller.update();
    });
    controls.appendChild(passBtn);
  }

  const newGameBtn = document.createElement('button');
  newGameBtn.className = 'fab-btn fab-btn-primary';
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
    !state.winner
  ) {
    setTimeout(() => makeAIMove(controller), 800);
  }
}

/**
 * Handle bar click
 */
function handleBarClick(controller: FabGameController, barId: string): void {
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
  controller.state = selectOperation(controller.state, operation);
  controller.update();
}

/**
 * Handle answer click
 */
function handleAnswerClick(controller: FabGameController, answerId: string): void {
  if (controller.state.phase !== 'confirmingMove') return;

  controller.state = executeMove(controller.state, answerId);
  controller.update();
}

// =============================================================================
// AI Logic
// =============================================================================

/**
 * Make an AI move using the AI module
 */
function makeAIMove(controller: FabGameController): void {
  const { state, aiPlayer, aiDifficulty } = controller;

  if (state.winner || !aiPlayer) return;

  // Get AI move using the AI module
  const move = getAIMove(state, aiPlayer, aiDifficulty);

  if (!move) {
    // No valid moves, pass
    controller.state = passTurn(state);
    controller.update();
    return;
  }

  // Execute move step by step
  let newState = selectBar1(state, move.bar1Id);
  newState = selectBar2(newState, move.bar2Id);
  newState = selectOperation(newState, move.operation);
  newState = executeMove(newState, move.answerId);

  controller.state = newState;
  controller.update();
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
export function newGameVsAI(container: HTMLElement): FabGameController {
  return initGame(container, true);
}
