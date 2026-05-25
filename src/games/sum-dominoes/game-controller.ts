// Sum Dominoes & Dice Game Controller
// Manages game flow, AI, and UI updates

import { SumDominoesState, Player, BoardPosition, getDiceSum } from './types';
import {
  createInitialState,
  doRollDice,
  selectDomino,
  placeDomino,
  passTurn,
  getValidPlacements,
} from './rules';
import {
  renderBoard,
  renderHand,
  renderDice,
  injectSDStyles,
  getPlayerName,
} from './board-ui';

// =============================================================================
// Game Controller
// =============================================================================

export interface SDGameController {
  state: SumDominoesState;
  container: HTMLElement;
  isAI: boolean;
  aiPlayer: Player | null;
  update: () => void;
  newGame: (vsAI: boolean) => void;
}

/**
 * Initialize the game
 */
export function initGame(
  container: HTMLElement,
  vsAI: boolean = false
): SDGameController {
  injectSDStyles();

  const controller: SDGameController = {
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
function updateUI(controller: SDGameController): void {
  const { container, state } = controller;
  container.innerHTML = '';

  // Main game area
  const gameArea = document.createElement('div');
  gameArea.className = 'sd-game-area';

  // Status
  const status = document.createElement('div');
  status.className = `sd-status ${state.currentPlayer}`;

  if (state.winner) {
    status.textContent = `${getPlayerName(state.winner)} wins!`;
  } else if (state.phase === 'rolling') {
    status.textContent = `${getPlayerName(state.currentPlayer)}'s turn - Roll the dice`;
  } else if (state.phase === 'placing') {
    if (state.selectedDomino) {
      status.textContent = `${getPlayerName(state.currentPlayer)} - Click a valid position to place`;
    } else {
      status.textContent = `${getPlayerName(state.currentPlayer)} - Select a domino to play`;
    }
  } else if (state.phase === 'passing') {
    status.textContent = `${getPlayerName(state.currentPlayer)} cannot play - must pass`;
  }

  gameArea.appendChild(status);

  // Winner banner
  if (state.winner) {
    const banner = document.createElement('div');
    banner.className = 'sd-winner-banner';
    banner.textContent = `${getPlayerName(state.winner)} Wins! 🎉`;
    gameArea.appendChild(banner);
  }

  // Dice area
  gameArea.appendChild(
    renderDice(
      state.currentDice,
      () => handleRoll(controller),
      state.phase === 'rolling' && !state.winner
    )
  );

  // Main layout
  const mainLayout = document.createElement('div');
  mainLayout.className = 'sd-main-layout';

  // Player 1 hand
  const p1Container = document.createElement('div');
  const p1Label = document.createElement('div');
  p1Label.className = 'sd-hand-label player1';
  p1Label.textContent = `Blue (${state.hands.player1.length} left)`;
  p1Container.appendChild(p1Label);
  p1Container.appendChild(
    renderHand(state, 'player1', (id) => handleDominoClick(controller, id))
  );

  // Board
  const board = renderBoard(state, (pos, orientation) =>
    handleCellClick(controller, pos, orientation)
  );

  // Player 2 hand
  const p2Container = document.createElement('div');
  const p2Label = document.createElement('div');
  p2Label.className = 'sd-hand-label player2';
  p2Label.textContent = `Red (${state.hands.player2.length} left)`;
  p2Container.appendChild(p2Label);
  p2Container.appendChild(
    renderHand(state, 'player2', (id) => handleDominoClick(controller, id))
  );

  mainLayout.appendChild(p1Container);
  mainLayout.appendChild(board);
  mainLayout.appendChild(p2Container);

  gameArea.appendChild(mainLayout);

  // Controls
  const controls = document.createElement('div');
  controls.className = 'sd-controls';

  if (state.phase === 'passing') {
    const passBtn = document.createElement('button');
    passBtn.className = 'sd-pass-btn';
    passBtn.textContent = 'Pass Turn';
    passBtn.addEventListener('click', () => handlePass(controller));
    controls.appendChild(passBtn);
  }

  const newGameBtn = document.createElement('button');
  newGameBtn.className = 'sd-roll-btn';
  newGameBtn.style.background = 'linear-gradient(135deg, #2196f3, #1976d2)';
  newGameBtn.textContent = 'New Game';
  newGameBtn.addEventListener('click', () => controller.newGame(controller.isAI));
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
 * Handle dice roll
 */
function handleRoll(controller: SDGameController): void {
  controller.state = doRollDice(controller.state);
  controller.update();
}

/**
 * Handle domino selection
 */
function handleDominoClick(controller: SDGameController, dominoId: string): void {
  controller.state = selectDomino(controller.state, dominoId);
  controller.update();
}

/**
 * Handle cell click for placement
 */
function handleCellClick(
  controller: SDGameController,
  position: BoardPosition,
  orientation: 'horizontal' | 'vertical'
): void {
  controller.state = placeDomino(controller.state, position, orientation);
  controller.update();
}

/**
 * Handle pass
 */
function handlePass(controller: SDGameController): void {
  controller.state = passTurn(controller.state);
  controller.update();
}

// =============================================================================
// AI Logic
// =============================================================================

/**
 * Make an AI move
 */
function makeAIMove(controller: SDGameController): void {
  const { state } = controller;

  if (state.winner) return;

  // Roll dice if needed
  if (state.phase === 'rolling') {
    controller.state = doRollDice(state);
    controller.update();
    setTimeout(() => makeAIMove(controller), 600);
    return;
  }

  // Pass if needed
  if (state.phase === 'passing') {
    controller.state = passTurn(state);
    controller.update();
    return;
  }

  // Find best move
  if (state.phase === 'placing' && state.currentDice) {
    const sum = getDiceSum(state.currentDice);
    const hand = state.hands[state.currentPlayer];

    // Find all playable dominoes and their placements
    const moves: Array<{
      domino: typeof hand[0];
      placement: { position: BoardPosition; orientation: 'horizontal' | 'vertical' };
      score: number;
    }> = [];

    for (const domino of hand) {
      const placements = getValidPlacements(state, domino, sum);
      for (const placement of placements) {
        // Score: prefer getting rid of higher pip counts
        const score = domino.face1 + domino.face2 + Math.random() * 2;
        moves.push({ domino, placement, score });
      }
    }

    if (moves.length > 0) {
      // Pick best move
      moves.sort((a, b) => b.score - a.score);
      const best = moves[0];

      // Select domino then place
      let newState = selectDomino(state, best.domino.id);
      newState = placeDomino(newState, best.placement.position, best.placement.orientation);
      controller.state = newState;
      controller.update();
    }
  }
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Create a new game vs human
 */
export function newGameVsHuman(container: HTMLElement): SDGameController {
  return initGame(container, false);
}

/**
 * Create a new game vs AI
 */
export function newGameVsAI(container: HTMLElement): SDGameController {
  return initGame(container, true);
}
