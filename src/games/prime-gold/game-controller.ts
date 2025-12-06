// Prime Gold Game Controller
// Manages game flow, AI, and UI updates

import { PrimeGoldState, Player, CONFIG } from './types';
import {
  createInitialState,
  rollDice,
  placeChip,
  passTurn,
  getValidPlacements,
  hasValidMoves,
} from './rules';
import {
  renderBoard,
  renderDice,
  renderExpressions,
  renderScores,
  renderMoveHistory,
  injectPrimeGoldStyles,
  getPlayerName,
} from './board-ui';

// =============================================================================
// Game Controller
// =============================================================================

export interface PrimeGoldController {
  state: PrimeGoldState;
  container: HTMLElement;
  isAI: boolean;
  aiPlayer: Player | null;
  update: () => void;
  newGame: (vsAI: boolean) => void;
}

/**
 * Initialize the game
 */
export function initGame(container: HTMLElement, vsAI: boolean = false): PrimeGoldController {
  injectPrimeGoldStyles();

  const controller: PrimeGoldController = {
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
function updateUI(controller: PrimeGoldController): void {
  const { container, state } = controller;
  container.innerHTML = '';

  // Main game area
  const gameArea = document.createElement('div');
  gameArea.className = 'pg-game-area';

  // Status bar
  const status = document.createElement('div');
  status.className = `pg-status ${state.currentPlayer}`;

  if (state.winner) {
    status.textContent = `${getPlayerName(state.winner)} wins with ${state.primeVeins[state.winner]} prime veins!`;
  } else if (state.winner === null && state.phase === 'gameOver') {
    status.textContent = "It's a tie!";
  } else if (state.phase === 'rolling') {
    status.textContent = `${getPlayerName(state.currentPlayer)}'s turn - Roll the dice`;
  } else if (state.phase === 'placing') {
    status.textContent = `${getPlayerName(state.currentPlayer)} - Select a number to place`;
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

  // Dice area
  mainLayout.appendChild(
    renderDice(state, () => handleRoll(controller))
  );

  // Board
  mainLayout.appendChild(
    renderBoard(state, (value, expr) => handlePlacement(controller, value, expr))
  );

  // Expressions list (when placing)
  if (state.phase === 'placing') {
    mainLayout.appendChild(
      renderExpressions(state, (value, expr) => handlePlacement(controller, value, expr))
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

  if (state.phase === 'placing' && !hasValidMoves(state)) {
    const passBtn = document.createElement('button');
    passBtn.className = 'pg-btn pg-btn-secondary';
    passBtn.textContent = 'Pass Turn';
    passBtn.addEventListener('click', () => {
      controller.state = passTurn(state);
      controller.update();
    });
    controls.appendChild(passBtn);
  }

  const newGameBtn = document.createElement('button');
  newGameBtn.className = 'pg-btn pg-btn-primary';
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
 * Handle dice roll
 */
function handleRoll(controller: PrimeGoldController): void {
  controller.state = rollDice(controller.state);
  controller.update();
}

/**
 * Handle chip placement
 */
function handlePlacement(controller: PrimeGoldController, value: number, expr: string): void {
  controller.state = placeChip(controller.state, value, expr);
  controller.update();
}

// =============================================================================
// AI Logic
// =============================================================================

/**
 * Make an AI move
 */
function makeAIMove(controller: PrimeGoldController): void {
  const { state } = controller;

  if (state.phase === 'gameOver') return;

  // Roll dice if needed
  if (state.phase === 'rolling') {
    controller.state = rollDice(state);
    controller.update();
    setTimeout(() => makeAIMove(controller), 600);
    return;
  }

  // Find best placement
  if (state.phase === 'placing') {
    const placements = getValidPlacements(state);

    if (placements.length === 0) {
      controller.state = passTurn(state);
      controller.update();
      return;
    }

    // Score each placement
    const scored = placements.map((p) => ({
      ...p,
      score: scoreAIPlacement(state, p.value),
    }));

    // Sort by score
    scored.sort((a, b) => b.score - a.score);

    // Pick from top choices
    const topMoves = scored.slice(0, Math.min(3, scored.length));
    const choice = topMoves[Math.floor(Math.random() * topMoves.length)];

    controller.state = placeChip(state, choice.value, choice.expr);
    controller.update();
  }
}

/**
 * Score a placement for AI
 */
function scoreAIPlacement(state: PrimeGoldState, value: number): number {
  let score = 0;

  // Find the cell
  for (const cell of state.cells.values()) {
    if (cell.value === value) {
      // Prefer primes (gold!)
      if (cell.isPrime) score += 10;

      // Prefer cells that could form veins
      // Check if adjacent to other owned primes
      const row = cell.row;
      const col = cell.col;

      // Check diagonal neighbors for our own primes
      const diagonals = [
        [row - 1, col - 1], [row - 1, col + 1],
        [row + 1, col - 1], [row + 1, col + 1],
      ];

      for (const [dr, dc] of diagonals) {
        const neighbor = state.cells.get(`${dr},${dc}`);
        if (neighbor && neighbor.owner === state.currentPlayer && neighbor.isPrime) {
          score += 5;
        }
      }

      // Prefer center area
      const center = Math.floor(CONFIG.BOARD_SIZE / 2);
      const dist = Math.abs(row - center) + Math.abs(col - center);
      score += (CONFIG.BOARD_SIZE - dist);

      break;
    }
  }

  // Add randomness
  score += Math.random() * 3;

  return score;
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
export function newGameVsAI(container: HTMLElement): PrimeGoldController {
  return initGame(container, true);
}
