// Kwatro-Sinko Game Controller
// Manages game flow, AI, and UI updates

import { KwaState, Player } from './types';
import {
  createInitialState,
  selectChip,
  clearSelection,
  moveChip,
  passTurn,
  getValidMoves,
  hasValidMoves,
} from './rules';
import {
  renderBoard,
  renderChipInfo,
  renderMoveHistory,
  injectKwaStyles,
  getPlayerName,
} from './board-ui';

// =============================================================================
// Game Controller
// =============================================================================

export interface KwaGameController {
  state: KwaState;
  container: HTMLElement;
  isAI: boolean;
  aiPlayer: Player | null;
  update: () => void;
  newGame: (vsAI: boolean) => void;
}

/**
 * Initialize the game
 */
export function initGame(container: HTMLElement, vsAI: boolean = false): KwaGameController {
  injectKwaStyles();

  const controller: KwaGameController = {
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
function updateUI(controller: KwaGameController): void {
  const { container, state } = controller;
  container.innerHTML = '';

  // Main game area
  const gameArea = document.createElement('div');
  gameArea.className = 'kwa-game-area';

  // Status bar
  const status = document.createElement('div');
  status.className = `kwa-status ${state.currentPlayer}`;

  if (state.winner) {
    status.textContent = `${getPlayerName(state.winner)} wins!`;
  } else if (state.phase === 'selectingChip') {
    status.textContent = `${getPlayerName(state.currentPlayer)}'s turn - Select a chip to move`;
  } else if (state.phase === 'selectingDest') {
    status.textContent = `${getPlayerName(state.currentPlayer)} - Click a green space to move`;
  }

  gameArea.appendChild(status);

  // Chip info
  gameArea.appendChild(renderChipInfo(state));

  // Target info
  const targetInfo = document.createElement('div');
  targetInfo.className = 'kwa-target-info';
  targetInfo.innerHTML = 'Create an alignment where: <strong>a + b - c = 4 or 5</strong>';
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
    (chipId) => handleChipClick(controller, chipId)
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

  if (state.selectedChip) {
    const clearBtn = document.createElement('button');
    clearBtn.className = 'kwa-btn kwa-btn-secondary';
    clearBtn.textContent = 'Clear Selection';
    clearBtn.addEventListener('click', () => {
      controller.state = clearSelection(state);
      controller.update();
    });
    controls.appendChild(clearBtn);
  }

  if (!hasValidMoves(state) && state.phase !== 'gameOver') {
    const passBtn = document.createElement('button');
    passBtn.className = 'kwa-btn kwa-btn-secondary';
    passBtn.textContent = 'Pass Turn';
    passBtn.addEventListener('click', () => {
      controller.state = passTurn(state);
      controller.update();
    });
    controls.appendChild(passBtn);
  }

  const newGameBtn = document.createElement('button');
  newGameBtn.className = 'kwa-btn kwa-btn-primary';
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
 * Handle chip click
 */
function handleChipClick(controller: KwaGameController, chipId: string): void {
  controller.state = selectChip(controller.state, chipId);
  controller.update();
}

/**
 * Handle node click
 */
function handleNodeClick(controller: KwaGameController, nodeId: string): void {
  controller.state = moveChip(controller.state, nodeId);
  controller.update();
}

// =============================================================================
// AI Logic
// =============================================================================

interface AIMove {
  chipId: string;
  nodeId: string;
  score: number;
}

/**
 * Make an AI move
 */
function makeAIMove(controller: KwaGameController): void {
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
  let newState = selectChip(state, move.chipId);
  newState = moveChip(newState, move.nodeId);

  controller.state = newState;
  controller.update();
}

/**
 * Find the best move for AI
 */
function findBestMove(state: KwaState): AIMove | null {
  const moves: AIMove[] = [];

  for (const chip of state.chips.values()) {
    if (chip.owner !== state.currentPlayer) continue;

    const validMoves = getValidMoves(state, chip.id);

    for (const nodeId of validMoves) {
      const node = state.nodes.get(nodeId);
      if (!node) continue;

      let score = 0;

      // Prefer moving to non-numbered spaces
      if (!node.isNumbered) {
        score += 5;
      }

      // Prefer moving toward center
      const match = nodeId.match(/n(\d+)-(\d+)/);
      if (match) {
        const row = parseInt(match[1]);
        const col = parseInt(match[2]);
        const centerDist = Math.abs(row - 2) + Math.abs(col - 2);
        score += (4 - centerDist);
      }

      // Add randomness
      score += Math.random() * 2;

      moves.push({ chipId: chip.id, nodeId, score });
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
export function newGameVsHuman(container: HTMLElement): KwaGameController {
  return initGame(container, false);
}

/**
 * Create a new game vs AI
 */
export function newGameVsAI(container: HTMLElement): KwaGameController {
  return initGame(container, true);
}
