// Par 55 Game Controller
// Manages game flow, AI, and UI updates

import { Par55State, Player } from './types';
import {
  createInitialState,
  selectBlock,
  clearSelection,
  placeBlock,
  passTurn,
  getValidPlacements,
  hasValidMoves,
  calculateScore,
} from './rules';
import {
  renderBoard,
  renderHand,
  renderScores,
  renderMoveHistory,
  injectPar55Styles,
  getPlayerName,
} from './board-ui';

// =============================================================================
// Game Controller
// =============================================================================

export interface Par55GameController {
  state: Par55State;
  container: HTMLElement;
  isAI: boolean;
  aiPlayer: Player | null;
  update: () => void;
  newGame: (vsAI: boolean) => void;
}

/**
 * Initialize the game
 */
export function initGame(container: HTMLElement, vsAI: boolean = false): Par55GameController {
  injectPar55Styles();

  const controller: Par55GameController = {
    state: createInitialState(),
    container,
    isAI: vsAI,
    aiPlayer: vsAI ? 'player2' : null,
    update: () => {},
    newGame: () => {},
  };

  controller.update = () => updateUI(controller);
  controller.newGame = (vsAI: boolean) => {
    controller.state = createInitialState();
    controller.isAI = vsAI;
    controller.aiPlayer = vsAI ? 'player2' : null;
    controller.update();
  };

  controller.update();

  return controller;
}

/**
 * Update the UI
 */
function updateUI(controller: Par55GameController): void {
  const { container, state } = controller;
  container.innerHTML = '';

  // Main game area
  const gameArea = document.createElement('div');
  gameArea.className = 'par55-game-area';

  // Status bar
  const status = document.createElement('div');
  status.className = `par55-status ${state.currentPlayer}`;

  if (state.winner) {
    status.textContent = `${getPlayerName(state.winner)} wins!`;
  } else if (state.winner === null && state.phase === 'gameOver') {
    status.textContent = "It's a tie!";
  } else if (state.phase === 'selectingBlock') {
    status.textContent = `${getPlayerName(state.currentPlayer)}'s turn - Select a block`;
  } else if (state.phase === 'placingBlock') {
    status.textContent = `${getPlayerName(state.currentPlayer)} - Place block on a green base`;
  }

  gameArea.appendChild(status);

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

  // Player 1 hand
  const p1Container = document.createElement('div');
  const p1Label = document.createElement('div');
  p1Label.className = 'par55-hand-label player1';
  p1Label.textContent = `Blue (${state.hands.player1.length})`;
  p1Container.appendChild(p1Label);
  p1Container.appendChild(
    renderHand(state, 'player1', (blockId) => handleBlockClick(controller, blockId))
  );

  // Board
  const board = renderBoard(state, (baseId) => handleBaseClick(controller, baseId));

  // Player 2 hand
  const p2Container = document.createElement('div');
  const p2Label = document.createElement('div');
  p2Label.className = 'par55-hand-label player2';
  p2Label.textContent = `Red (${state.hands.player2.length})`;
  p2Container.appendChild(p2Label);
  p2Container.appendChild(
    renderHand(state, 'player2', (blockId) => handleBlockClick(controller, blockId))
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

  if (state.selectedBlock) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'par55-btn par55-btn-secondary';
    clearBtn.textContent = 'Clear Selection';
    clearBtn.addEventListener('click', () => {
      controller.state = clearSelection(state);
      controller.update();
    });
    controls.appendChild(clearBtn);
  }

  if (!hasValidMoves(state) && state.phase !== 'gameOver') {
    const passBtn = document.createElement('button');
    passBtn.className = 'par55-btn par55-btn-secondary';
    passBtn.textContent = 'Pass Turn';
    passBtn.addEventListener('click', () => {
      controller.state = passTurn(state);
      controller.update();
    });
    controls.appendChild(passBtn);
  }

  const newGameBtn = document.createElement('button');
  newGameBtn.className = 'par55-btn par55-btn-primary';
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
 * Handle block click
 */
function handleBlockClick(controller: Par55GameController, blockId: string): void {
  controller.state = selectBlock(controller.state, blockId);
  controller.update();
}

/**
 * Handle base click
 */
function handleBaseClick(controller: Par55GameController, baseId: string): void {
  controller.state = placeBlock(controller.state, baseId);
  controller.update();
}

// =============================================================================
// AI Logic
// =============================================================================

interface AIMove {
  blockId: string;
  baseId: string;
  score: number;
}

/**
 * Make an AI move
 */
function makeAIMove(controller: Par55GameController): void {
  const { state } = controller;

  if (state.phase === 'gameOver') return;

  // If no valid moves, pass
  if (!hasValidMoves(state)) {
    controller.state = passTurn(state);
    controller.update();
    return;
  }

  // Find best move
  const move = findBestMove(state);

  if (!move) {
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

/**
 * Find the best move for AI
 */
function findBestMove(state: Par55State): AIMove | null {
  const hand = state.hands[state.currentPlayer];
  const validBases = getValidPlacements(state);

  if (hand.length === 0 || validBases.length === 0) return null;

  const moves: AIMove[] = [];

  for (const block of hand) {
    for (const baseId of validBases) {
      const { totalPoints } = calculateScore(state, block, baseId);
      moves.push({
        blockId: block.id,
        baseId,
        score: totalPoints + Math.random() * 0.5, // Add slight randomness
      });
    }
  }

  if (moves.length === 0) return null;

  // Sort by score and pick best
  moves.sort((a, b) => b.score - a.score);

  // Pick from top 3 for variety
  const topMoves = moves.slice(0, Math.min(3, moves.length));
  return topMoves[Math.floor(Math.random() * topMoves.length)];
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
export function newGameVsAI(container: HTMLElement): Par55GameController {
  return initGame(container, true);
}
