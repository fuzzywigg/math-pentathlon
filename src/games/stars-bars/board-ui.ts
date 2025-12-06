// Stars & Bars Board UI
// Renders the attribute logic board and cards

import {
  StarsState,
  AttributeCard,
  Player,
  CONFIG,
  COLOR_VALUES,
  countDifferences,
} from './types';
import { getValidPlacements } from './rules';

// =============================================================================
// Style Injection
// =============================================================================

let stylesInjected = false;

export function injectStarsStyles(): void {
  if (stylesInjected) return;
  stylesInjected = true;

  const style = document.createElement('style');
  style.textContent = `
    .stars-game-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .stars-status {
      font-size: 1.2rem;
      font-weight: bold;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      text-align: center;
    }

    .stars-status.player1 {
      background: rgba(25, 118, 210, 0.2);
      color: #1976d2;
    }

    .stars-status.player2 {
      background: rgba(229, 57, 53, 0.2);
      color: #e53935;
    }

    .stars-scores {
      display: flex;
      gap: 2rem;
      font-size: 1.1rem;
    }

    .stars-score {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: bold;
    }

    .stars-score.player1 {
      background: rgba(25, 118, 210, 0.15);
      color: #1976d2;
    }

    .stars-score.player2 {
      background: rgba(229, 57, 53, 0.15);
      color: #e53935;
    }

    .stars-main-layout {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
      flex-wrap: wrap;
      justify-content: center;
    }

    .stars-board-container {
      background: #2d2d2d;
      padding: 1rem;
      border-radius: 12px;
    }

    .stars-board {
      display: grid;
      grid-template-columns: repeat(${CONFIG.BOARD_SIZE}, 70px);
      gap: 4px;
    }

    .stars-cell {
      width: 70px;
      height: 70px;
      background: #3d3d3d;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
    }

    .stars-cell.star {
      background: linear-gradient(135deg, #4a4a4a, #3d3d3d);
    }

    .stars-cell.star::before {
      content: '\\2605';
      position: absolute;
      top: 2px;
      right: 4px;
      font-size: 12px;
      color: gold;
      opacity: 0.6;
    }

    .stars-cell.valid {
      background: rgba(76, 175, 80, 0.3);
      box-shadow: inset 0 0 0 2px #4caf50;
    }

    .stars-cell.valid:hover {
      background: rgba(76, 175, 80, 0.5);
    }

    .stars-cell.last-move {
      box-shadow: 0 0 0 3px #ff9800;
    }

    .stars-cell.player1 {
      box-shadow: inset 0 0 0 2px rgba(25, 118, 210, 0.5);
    }

    .stars-cell.player2 {
      box-shadow: inset 0 0 0 2px rgba(229, 57, 53, 0.5);
    }

    .stars-hand-container {
      background: #2d2d2d;
      padding: 1rem;
      border-radius: 12px;
    }

    .stars-hand-label {
      font-weight: bold;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .stars-hand-label.player1 { color: #1976d2; }
    .stars-hand-label.player2 { color: #e53935; }

    .stars-hand {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .stars-card {
      width: 60px;
      height: 60px;
      background: #4d4d4d;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }

    .stars-card:hover {
      transform: scale(1.05);
    }

    .stars-card.selected {
      box-shadow: 0 0 0 3px #4caf50;
      transform: scale(1.1);
    }

    .stars-card.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .stars-winner-banner {
      font-size: 1.5rem;
      font-weight: bold;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #ffd700, #ffb300);
      color: #333;
      border-radius: 12px;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }

    .stars-controls {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .stars-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .stars-btn-primary {
      background: #4caf50;
      color: white;
    }

    .stars-btn-primary:hover {
      background: #388e3c;
    }

    .stars-btn-secondary {
      background: #666;
      color: white;
    }

    .stars-btn-secondary:hover {
      background: #555;
    }

    .stars-move-history {
      background: #2d2d2d;
      padding: 1rem;
      border-radius: 12px;
      max-height: 300px;
      overflow-y: auto;
      min-width: 200px;
    }

    .stars-move-history h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      color: #aaa;
    }

    .stars-move-item {
      font-size: 0.85rem;
      padding: 4px 0;
      border-bottom: 1px solid #3d3d3d;
    }

    .stars-move-item:last-child {
      border-bottom: none;
    }

    .stars-move-item.player1 { color: #64b5f6; }
    .stars-move-item.player2 { color: #ef9a9a; }

    .stars-tooltip {
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      z-index: 100;
      pointer-events: none;
      white-space: nowrap;
    }
  `;
  document.head.appendChild(style);
}

// =============================================================================
// Player Names
// =============================================================================

export function getPlayerName(player: Player): string {
  return player === 'player1' ? 'Blue' : 'Red';
}

// =============================================================================
// Card Rendering
// =============================================================================

/**
 * Render an attribute card as SVG
 */
function renderCardSVG(card: AttributeCard, size: number = 50): SVGSVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', size.toString());
  svg.setAttribute('height', size.toString());
  svg.setAttribute('viewBox', '0 0 50 50');

  const color = COLOR_VALUES[card.color];
  const shapeSize = card.size === 'large' ? 18 : 12;
  const strokeWidth = card.thickness === 'thick' ? 4 : 2;

  let shape: SVGElement;

  switch (card.shape) {
    case 'circle':
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      shape.setAttribute('cx', '25');
      shape.setAttribute('cy', '25');
      shape.setAttribute('r', shapeSize.toString());
      break;

    case 'square':
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      shape.setAttribute('x', (25 - shapeSize).toString());
      shape.setAttribute('y', (25 - shapeSize).toString());
      shape.setAttribute('width', (shapeSize * 2).toString());
      shape.setAttribute('height', (shapeSize * 2).toString());
      break;

    case 'rectangle':
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      shape.setAttribute('x', (25 - shapeSize).toString());
      shape.setAttribute('y', (25 - shapeSize * 0.6).toString());
      shape.setAttribute('width', (shapeSize * 2).toString());
      shape.setAttribute('height', (shapeSize * 1.2).toString());
      break;

    case 'triangle': {
      const triSize = shapeSize;
      const triPoints = [
        `25,${25 - triSize}`,
        `${25 + triSize},${25 + triSize * 0.7}`,
        `${25 - triSize},${25 + triSize * 0.7}`,
      ].join(' ');
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      shape.setAttribute('points', triPoints);
      break;
    }

    case 'hexagon': {
      const hexSize = shapeSize;
      const hexPoints: string[] = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const x = 25 + hexSize * Math.cos(angle);
        const y = 25 + hexSize * Math.sin(angle);
        hexPoints.push(`${x},${y}`);
      }
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      shape.setAttribute('points', hexPoints.join(' '));
      break;
    }

    default:
      shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      shape.setAttribute('cx', '25');
      shape.setAttribute('cy', '25');
      shape.setAttribute('r', '15');
  }

  shape.setAttribute('fill', color);
  shape.setAttribute('stroke', '#fff');
  shape.setAttribute('stroke-width', strokeWidth.toString());

  svg.appendChild(shape);
  return svg;
}

// =============================================================================
// Board Rendering
// =============================================================================

/**
 * Render the game board
 */
export function renderBoard(
  state: StarsState,
  onCellClick: (row: number, col: number) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'stars-board-container';

  const board = document.createElement('div');
  board.className = 'stars-board';

  const validPlacements = state.phase === 'placingCard' ? getValidPlacements(state) : [];
  const validSet = new Set(validPlacements.map((p) => `${p.row},${p.col}`));

  for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
    for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
      const cell = state.cells[row][col];
      const cellEl = document.createElement('div');
      cellEl.className = 'stars-cell';

      if (cell.isStar) cellEl.classList.add('star');
      if (cell.owner) cellEl.classList.add(cell.owner);
      if (state.lastMove && state.lastMove.row === row && state.lastMove.col === col) {
        cellEl.classList.add('last-move');
      }

      const isValid = validSet.has(`${row},${col}`);
      if (isValid) {
        cellEl.classList.add('valid');
        cellEl.addEventListener('click', () => onCellClick(row, col));

        // Show score preview on hover
        if (state.selectedCard) {
          const previewScore = calculatePreviewScore(state, state.selectedCard, row, col);
          cellEl.title = `+${previewScore} points`;
        }
      }

      if (cell.card) {
        const cardSvg = renderCardSVG(cell.card, 50);
        cellEl.appendChild(cardSvg);
      }

      board.appendChild(cellEl);
    }
  }

  container.appendChild(board);
  return container;
}

/**
 * Calculate preview score for placement
 */
function calculatePreviewScore(
  state: StarsState,
  card: AttributeCard,
  row: number,
  col: number
): number {
  const cell = state.cells[row][col];
  let score = 0;

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
  ];

  for (const [dr, dc] of directions) {
    const adjRow = row + dr;
    const adjCol = col + dc;

    if (
      adjRow >= 0 &&
      adjRow < CONFIG.BOARD_SIZE &&
      adjCol >= 0 &&
      adjCol < CONFIG.BOARD_SIZE
    ) {
      const adjCell = state.cells[adjRow][adjCol];
      if (adjCell.card) {
        score += countDifferences(card, adjCell.card);
      }
    }
  }

  if (cell.isStar) score *= 2;
  return score;
}

// =============================================================================
// Hand Rendering
// =============================================================================

/**
 * Render a player's hand
 */
export function renderPlayerHand(
  state: StarsState,
  player: Player,
  onCardClick: (cardId: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'stars-hand-container';

  const label = document.createElement('div');
  label.className = `stars-hand-label ${player}`;
  label.textContent = `${getPlayerName(player)}'s Hand`;
  container.appendChild(label);

  const hand = document.createElement('div');
  hand.className = 'stars-hand';

  const isCurrentPlayer = state.currentPlayer === player;
  const cards = state.playerHands[player];

  for (const card of cards) {
    const cardEl = document.createElement('div');
    cardEl.className = 'stars-card';

    if (!isCurrentPlayer || state.phase === 'gameOver') {
      cardEl.classList.add('disabled');
    }

    if (state.selectedCard?.id === card.id) {
      cardEl.classList.add('selected');
    }

    const cardSvg = renderCardSVG(card, 50);
    cardEl.appendChild(cardSvg);

    // Tooltip showing attributes
    cardEl.title = `${card.size} ${card.thickness} ${card.color} ${card.shape}`;

    if (isCurrentPlayer && state.phase !== 'gameOver') {
      cardEl.addEventListener('click', () => onCardClick(card.id));
    }

    hand.appendChild(cardEl);
  }

  container.appendChild(hand);
  return container;
}

// =============================================================================
// Score Rendering
// =============================================================================

/**
 * Render scores
 */
export function renderScores(state: StarsState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'stars-scores';

  const p1Score = document.createElement('div');
  p1Score.className = 'stars-score player1';
  p1Score.textContent = `Blue: ${state.playerScores.player1} / ${CONFIG.TARGET_SCORE}`;

  const p2Score = document.createElement('div');
  p2Score.className = 'stars-score player2';
  p2Score.textContent = `Red: ${state.playerScores.player2} / ${CONFIG.TARGET_SCORE}`;

  container.appendChild(p1Score);
  container.appendChild(p2Score);

  return container;
}

// =============================================================================
// Move History
// =============================================================================

/**
 * Render move history
 */
export function renderMoveHistory(state: StarsState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'stars-move-history';

  const title = document.createElement('h3');
  title.textContent = 'Move History';
  container.appendChild(title);

  for (let i = state.moveHistory.length - 1; i >= 0; i--) {
    const move = state.moveHistory[i];
    const moveEl = document.createElement('div');
    moveEl.className = `stars-move-item ${move.player}`;

    const posStr = `(${move.row + 1},${String.fromCharCode(65 + move.col)})`;
    moveEl.textContent = `${getPlayerName(move.player)}: ${move.card.shape} at ${posStr} = +${move.score}`;

    container.appendChild(moveEl);
  }

  return container;
}
