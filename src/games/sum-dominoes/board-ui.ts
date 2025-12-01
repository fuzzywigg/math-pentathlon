// Sum Dominoes & Dice Board UI
// Rendering dominoes, board, and dice

import {
  SumDominoesState,
  Domino,
  PlacedDomino,
  BoardPosition,
  CONFIG,
  getDiceSum,
} from './types';
import { getValidPlacements } from './rules';

// Colors
const COLORS = {
  background: '#2d5a27',
  boardCell: '#3d7a37',
  boardBorder: '#1a3a17',
  domino: '#f5f5dc',
  dominoBorder: '#333',
  pip: '#111',
  player1: '#2196f3',
  player2: '#f44336',
  player1Light: '#bbdefb',
  player2Light: '#ffcdd2',
  valid: '#4caf50',
  validLight: '#81c784',
  selected: '#ff9800',
};

// Domino dimensions
const DOMINO_WIDTH = 40;
const DOMINO_HEIGHT = 20;
const CELL_SIZE = 22;

/**
 * Render the game board
 */
export function renderBoard(
  state: SumDominoesState,
  onCellClick: (pos: BoardPosition, orientation: 'horizontal' | 'vertical') => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'sd-board';

  // Get valid placements for selected domino
  const validPlacements = new Set<string>();
  if (state.selectedDomino && state.currentDice) {
    const domino = state.hands[state.currentPlayer].find(
      (d) => d.id === state.selectedDomino
    );
    if (domino) {
      const sum = getDiceSum(state.currentDice);
      const placements = getValidPlacements(state, domino, sum);
      placements.forEach((p) => {
        validPlacements.add(`${p.position.row}-${p.position.col}-${p.orientation}`);
      });
    }
  }

  // Track which cells are already rendered (for double-cell dominoes)
  const renderedCells = new Set<string>();

  for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'sd-row';

    for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
      const cellKey = `${row}-${col}`;
      if (renderedCells.has(cellKey)) {
        // This cell is part of a domino already rendered
        continue;
      }

      const placed = state.board[row][col];

      if (placed) {
        // Render domino
        const dominoEl = renderPlacedDomino(placed);
        rowEl.appendChild(dominoEl);

        // Mark both cells as rendered
        renderedCells.add(cellKey);
        if (placed.orientation === 'horizontal') {
          renderedCells.add(`${row}-${col + 1}`);
        } else {
          renderedCells.add(`${row + 1}-${col}`);
        }
      } else {
        // Empty cell
        const cell = document.createElement('div');
        cell.className = 'sd-cell';
        cell.dataset.row = String(row);
        cell.dataset.col = String(col);

        // Check if valid placement
        const isValidH = validPlacements.has(`${row}-${col}-horizontal`);
        const isValidV = validPlacements.has(`${row}-${col}-vertical`);

        if (isValidH || isValidV) {
          cell.classList.add('sd-cell-valid');

          cell.addEventListener('click', () => {
            // Prefer horizontal, but use vertical if only that works
            const orientation = isValidH ? 'horizontal' : 'vertical';
            onCellClick({ row, col }, orientation);
          });
        }

        rowEl.appendChild(cell);
      }
    }

    container.appendChild(rowEl);
  }

  return container;
}

/**
 * Render a placed domino
 */
function renderPlacedDomino(placed: PlacedDomino): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = `sd-domino sd-domino-${placed.orientation}`;

  // Face 1
  const face1 = createDominoFace(placed.domino.face1);
  wrapper.appendChild(face1);

  // Divider
  const divider = document.createElement('div');
  divider.className = 'sd-domino-divider';
  wrapper.appendChild(divider);

  // Face 2
  const face2 = createDominoFace(placed.domino.face2);
  wrapper.appendChild(face2);

  return wrapper;
}

/**
 * Create a domino face with pips
 */
function createDominoFace(value: number): HTMLElement {
  const face = document.createElement('div');
  face.className = 'sd-domino-face';

  // Add pips based on value
  const pipPositions = getPipPositions(value);
  for (const [x, y] of pipPositions) {
    const pip = document.createElement('div');
    pip.className = 'sd-pip';
    pip.style.left = `${x}%`;
    pip.style.top = `${y}%`;
    face.appendChild(pip);
  }

  return face;
}

/**
 * Get pip positions for a value (percentage-based)
 */
function getPipPositions(value: number): [number, number][] {
  const positions: Record<number, [number, number][]> = {
    0: [],
    1: [[50, 50]],
    2: [
      [25, 25],
      [75, 75],
    ],
    3: [
      [25, 25],
      [50, 50],
      [75, 75],
    ],
    4: [
      [25, 25],
      [75, 25],
      [25, 75],
      [75, 75],
    ],
    5: [
      [25, 25],
      [75, 25],
      [50, 50],
      [25, 75],
      [75, 75],
    ],
    6: [
      [25, 25],
      [75, 25],
      [25, 50],
      [75, 50],
      [25, 75],
      [75, 75],
    ],
  };
  return positions[value] || [];
}

/**
 * Render player's hand
 */
export function renderHand(
  state: SumDominoesState,
  player: 'player1' | 'player2',
  onDominoClick: (dominoId: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = `sd-hand sd-hand-${player}`;

  const hand = state.hands[player];
  const isCurrentPlayer = state.currentPlayer === player;
  const canSelect = isCurrentPlayer && state.phase === 'placing' && state.currentDice;

  for (const domino of hand) {
    const dominoEl = createHandDomino(
      domino,
      state.selectedDomino === domino.id,
      canSelect
        ? (() => {
            const sum = getDiceSum(state.currentDice!);
            const placements = getValidPlacements(state, domino, sum);
            return placements.length > 0;
          })()
        : false
    );

    if (canSelect) {
      dominoEl.addEventListener('click', () => onDominoClick(domino.id));
    }

    container.appendChild(dominoEl);
  }

  return container;
}

/**
 * Create a domino for the hand display
 */
function createHandDomino(
  domino: Domino,
  isSelected: boolean,
  isPlayable: boolean
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'sd-hand-domino';

  if (isSelected) wrapper.classList.add('sd-hand-domino-selected');
  if (isPlayable) wrapper.classList.add('sd-hand-domino-playable');

  // Face 1
  const face1 = createDominoFace(domino.face1);
  wrapper.appendChild(face1);

  // Divider
  const divider = document.createElement('div');
  divider.className = 'sd-domino-divider';
  wrapper.appendChild(divider);

  // Face 2
  const face2 = createDominoFace(domino.face2);
  wrapper.appendChild(face2);

  return wrapper;
}

/**
 * Render dice display
 */
export function renderDice(
  dice: [number, number] | null,
  onRoll: () => void,
  canRoll: boolean
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'sd-dice-area';

  if (!dice) {
    const rollBtn = document.createElement('button');
    rollBtn.className = 'sd-roll-btn';
    rollBtn.textContent = 'Roll Dice';
    rollBtn.disabled = !canRoll;
    rollBtn.addEventListener('click', onRoll);
    container.appendChild(rollBtn);
  } else {
    const diceDisplay = document.createElement('div');
    diceDisplay.className = 'sd-dice-display';

    const die1 = createDie(dice[0]);
    const die2 = createDie(dice[1]);
    const sum = document.createElement('div');
    sum.className = 'sd-dice-sum';
    sum.textContent = `= ${dice[0] + dice[1]}`;

    diceDisplay.appendChild(die1);
    diceDisplay.appendChild(die2);
    diceDisplay.appendChild(sum);

    container.appendChild(diceDisplay);
  }

  return container;
}

/**
 * Create a die element
 */
function createDie(value: number): HTMLElement {
  const die = document.createElement('div');
  die.className = 'sd-die';

  const pipPositions = getPipPositions(value);
  for (const [x, y] of pipPositions) {
    const pip = document.createElement('div');
    pip.className = 'sd-die-pip';
    pip.style.left = `${x}%`;
    pip.style.top = `${y}%`;
    die.appendChild(pip);
  }

  return die;
}

/**
 * Inject CSS styles
 */
export function injectSDStyles(): void {
  const existingStyle = document.getElementById('sd-styles');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'sd-styles';
  style.textContent = `
    .sd-game-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .sd-main-layout {
      display: flex;
      gap: 2rem;
      align-items: flex-start;
    }

    .sd-board {
      background: ${COLORS.background};
      padding: 8px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }

    .sd-row {
      display: flex;
    }

    .sd-cell {
      width: ${CELL_SIZE}px;
      height: ${CELL_SIZE}px;
      background: ${COLORS.boardCell};
      border: 1px solid ${COLORS.boardBorder};
    }

    .sd-cell-valid {
      background: ${COLORS.validLight};
      cursor: pointer;
    }

    .sd-cell-valid:hover {
      background: ${COLORS.valid};
    }

    .sd-domino {
      display: flex;
      background: ${COLORS.domino};
      border: 2px solid ${COLORS.dominoBorder};
      border-radius: 4px;
      box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
    }

    .sd-domino-horizontal {
      flex-direction: row;
      width: ${CELL_SIZE * 2}px;
      height: ${CELL_SIZE}px;
    }

    .sd-domino-vertical {
      flex-direction: column;
      width: ${CELL_SIZE}px;
      height: ${CELL_SIZE * 2}px;
    }

    .sd-domino-face {
      position: relative;
      flex: 1;
    }

    .sd-domino-divider {
      background: ${COLORS.dominoBorder};
    }

    .sd-domino-horizontal .sd-domino-divider {
      width: 1px;
    }

    .sd-domino-vertical .sd-domino-divider {
      height: 1px;
    }

    .sd-pip {
      position: absolute;
      width: 4px;
      height: 4px;
      background: ${COLORS.pip};
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }

    .sd-hand {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 1rem;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      max-width: 300px;
    }

    .sd-hand-player1 {
      border: 2px solid ${COLORS.player1};
    }

    .sd-hand-player2 {
      border: 2px solid ${COLORS.player2};
    }

    .sd-hand-domino {
      display: flex;
      flex-direction: row;
      background: ${COLORS.domino};
      border: 2px solid ${COLORS.dominoBorder};
      border-radius: 6px;
      padding: 2px;
      cursor: default;
      transition: all 0.15s ease;
      width: ${DOMINO_WIDTH}px;
      height: ${DOMINO_HEIGHT}px;
    }

    .sd-hand-domino-playable {
      cursor: pointer;
      box-shadow: 0 0 0 2px ${COLORS.valid};
    }

    .sd-hand-domino-playable:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.2), 0 0 0 2px ${COLORS.valid};
    }

    .sd-hand-domino-selected {
      box-shadow: 0 0 0 3px ${COLORS.selected} !important;
      transform: translateY(-4px);
    }

    .sd-dice-area {
      display: flex;
      justify-content: center;
      padding: 1rem;
    }

    .sd-roll-btn {
      padding: 1rem 2rem;
      font-size: 1.25rem;
      font-weight: bold;
      background: linear-gradient(135deg, #f57c00, #ff9800);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(245, 124, 0, 0.3);
      transition: all 0.2s ease;
    }

    .sd-roll-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(245, 124, 0, 0.4);
    }

    .sd-roll-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .sd-dice-display {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .sd-die {
      width: 50px;
      height: 50px;
      background: white;
      border: 2px solid #333;
      border-radius: 8px;
      position: relative;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .sd-die-pip {
      position: absolute;
      width: 8px;
      height: 8px;
      background: #111;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }

    .sd-dice-sum {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }

    .sd-status {
      text-align: center;
      padding: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .sd-status.player1 {
      color: ${COLORS.player1};
    }

    .sd-status.player2 {
      color: ${COLORS.player2};
    }

    .sd-hands-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .sd-hand-label {
      font-weight: bold;
      margin-bottom: 0.5rem;
    }

    .sd-hand-label.player1 {
      color: ${COLORS.player1};
    }

    .sd-hand-label.player2 {
      color: ${COLORS.player2};
    }

    .sd-winner-banner {
      text-align: center;
      padding: 1.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(135deg, #ffd700, #ffec8b);
      border-radius: 12px;
      margin: 1rem;
      animation: sd-glow 1s ease-in-out infinite alternate;
    }

    @keyframes sd-glow {
      from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }
      to { box-shadow: 0 0 20px rgba(255,215,0,0.8); }
    }

    .sd-pass-btn {
      padding: 0.75rem 1.5rem;
      background: #ff9800;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }

    .sd-pass-btn:hover {
      background: #f57c00;
    }

    .sd-controls {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    @media (max-width: 768px) {
      .sd-main-layout {
        flex-direction: column;
        align-items: center;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Get player display name
 */
export function getPlayerName(player: 'player1' | 'player2'): string {
  return player === 'player1' ? 'Blue' : 'Red';
}
