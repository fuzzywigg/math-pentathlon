// Par 55 Board UI
// Rendering pentagon bases, attribute blocks, and game state

import {
  Par55State,
  Base,
  AttributeBlock,
  Player,
  CONFIG,
  BlockColor,
} from './types';
import { getValidPlacements, calculateScore } from './rules';

// Colors
const PLAYER_COLORS = {
  player1: '#2196f3',
  player2: '#f44336',
};

const BLOCK_COLORS: Record<BlockColor, string> = {
  red: '#e53935',
  blue: '#1e88e5',
  yellow: '#fdd835',
};

// Dimensions
const BASE_SIZE = 50; // Size of each pentagon base
const BLOCK_SIZE = 36; // Size of block shape

/**
 * Render the game board
 */
export function renderBoard(
  state: Par55State,
  onBaseClick: (baseId: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'par55-board';

  const validPlacements = state.phase === 'placingBlock' ? new Set(getValidPlacements(state)) : new Set<string>();

  // Create SVG
  const svgWidth = CONFIG.BOARD_COLS * BASE_SIZE * 1.2 + BASE_SIZE;
  const svgHeight = CONFIG.BOARD_ROWS * BASE_SIZE * 0.9 + BASE_SIZE;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(svgWidth));
  svg.setAttribute('height', String(svgHeight));
  svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
  svg.classList.add('par55-svg');

  // Render bases
  for (const base of state.bases.values()) {
    const isValid = validPlacements.has(base.id);
    const isLastMove = state.lastMoveBaseId === base.id;
    const baseGroup = renderBase(state, base, isValid, isLastMove, onBaseClick);
    svg.appendChild(baseGroup);
  }

  container.appendChild(svg);
  return container;
}

/**
 * Get position for a base
 */
function getBasePosition(row: number, col: number): { x: number; y: number } {
  const isOddRow = row % 2 === 1;
  const xOffset = isOddRow ? BASE_SIZE * 0.6 : 0;

  return {
    x: col * BASE_SIZE * 1.2 + xOffset + BASE_SIZE,
    y: row * BASE_SIZE * 0.9 + BASE_SIZE,
  };
}

/**
 * Render a single base
 */
function renderBase(
  state: Par55State,
  base: Base,
  isValid: boolean,
  isLastMove: boolean,
  onClick: (baseId: string) => void
): SVGGElement {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const pos = getBasePosition(base.row, base.col);

  // Pentagon path
  const pentagon = createPentagon(pos.x, pos.y, BASE_SIZE / 2);
  pentagon.setAttribute('fill', base.block ? '#e8e8e8' : '#f5f5f5');
  pentagon.setAttribute('stroke', isLastMove ? '#ff9800' : (isValid ? '#4caf50' : '#999'));
  pentagon.setAttribute('stroke-width', isLastMove ? '3' : (isValid ? '3' : '1.5'));

  if (isValid) {
    pentagon.style.cursor = 'pointer';
    pentagon.classList.add('par55-valid-base');
  }

  group.appendChild(pentagon);

  // Render block if present
  if (base.block) {
    const blockGroup = renderBlock(base.block, pos.x, pos.y, base.placedBy);
    group.appendChild(blockGroup);
  }

  // Add hover preview if valid
  if (isValid && state.selectedBlock) {
    const hand = state.hands[state.currentPlayer];
    const selectedBlock = hand.find((b) => b.id === state.selectedBlock);

    if (selectedBlock) {
      // Show potential score on hover
      const { totalPoints } = calculateScore(state, selectedBlock, base.id);
      if (totalPoints > 0) {
        const scorePreview = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        scorePreview.setAttribute('x', String(pos.x));
        scorePreview.setAttribute('y', String(pos.y + BASE_SIZE / 2 + 12));
        scorePreview.setAttribute('text-anchor', 'middle');
        scorePreview.setAttribute('font-size', '12');
        scorePreview.setAttribute('font-weight', 'bold');
        scorePreview.setAttribute('fill', '#4caf50');
        scorePreview.textContent = `+${totalPoints}`;
        scorePreview.classList.add('par55-score-preview');
        group.appendChild(scorePreview);
      }
    }
  }

  // Click handler
  if (isValid) {
    group.addEventListener('click', () => onClick(base.id));
  }

  return group;
}

/**
 * Create pentagon SVG path
 */
function createPentagon(cx: number, cy: number, radius: number): SVGPolygonElement {
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  const points: string[] = [];

  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 - 90) * (Math.PI / 180); // Start from top
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  polygon.setAttribute('points', points.join(' '));
  return polygon;
}

/**
 * Render an attribute block
 */
function renderBlock(
  block: AttributeBlock,
  cx: number,
  cy: number,
  placedBy: Player | null
): SVGGElement {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  const size = block.size === 'large' ? BLOCK_SIZE : BLOCK_SIZE * 0.7;
  const strokeWidth = block.thickness === 'thick' ? 4 : 2;
  const fillColor = BLOCK_COLORS[block.color];

  let shapeEl: SVGElement;

  switch (block.shape) {
    case 'circle':
      shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      shapeEl.setAttribute('cx', String(cx));
      shapeEl.setAttribute('cy', String(cy));
      shapeEl.setAttribute('r', String(size / 2));
      break;

    case 'square':
      shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      shapeEl.setAttribute('x', String(cx - size / 2));
      shapeEl.setAttribute('y', String(cy - size / 2));
      shapeEl.setAttribute('width', String(size));
      shapeEl.setAttribute('height', String(size));
      break;

    case 'triangle': {
      shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const triPoints = [
        `${cx},${cy - size / 2}`,
        `${cx - size / 2},${cy + size / 2}`,
        `${cx + size / 2},${cy + size / 2}`,
      ];
      shapeEl.setAttribute('points', triPoints.join(' '));
      break;
    }

    case 'rectangle':
      shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      shapeEl.setAttribute('x', String(cx - size / 2));
      shapeEl.setAttribute('y', String(cy - size / 3));
      shapeEl.setAttribute('width', String(size));
      shapeEl.setAttribute('height', String(size * 0.6));
      break;

    case 'hexagon': {
      shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const hexPoints: string[] = [];
      for (let i = 0; i < 6; i++) {
        const angle = (i * 60 - 30) * (Math.PI / 180);
        const x = cx + (size / 2) * Math.cos(angle);
        const y = cy + (size / 2) * Math.sin(angle);
        hexPoints.push(`${x},${y}`);
      }
      shapeEl.setAttribute('points', hexPoints.join(' '));
      break;
    }

    default:
      shapeEl = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      shapeEl.setAttribute('cx', String(cx));
      shapeEl.setAttribute('cy', String(cy));
      shapeEl.setAttribute('r', String(size / 2));
  }

  shapeEl.setAttribute('fill', fillColor);
  shapeEl.setAttribute('stroke', '#333');
  shapeEl.setAttribute('stroke-width', String(strokeWidth));

  // Add player indicator ring if placed by a player
  if (placedBy) {
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', String(cx));
    ring.setAttribute('cy', String(cy));
    ring.setAttribute('r', String(size / 2 + 4));
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', PLAYER_COLORS[placedBy]);
    ring.setAttribute('stroke-width', '2');
    ring.setAttribute('opacity', '0.6');
    group.appendChild(ring);
  }

  group.appendChild(shapeEl);
  return group;
}

/**
 * Render player's hand
 */
export function renderHand(
  state: Par55State,
  player: Player,
  onBlockClick: (blockId: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = `par55-hand par55-hand-${player}`;

  const hand = state.hands[player];
  const isCurrentPlayer = state.currentPlayer === player;
  const canSelect = isCurrentPlayer && state.phase === 'selectingBlock';

  for (const block of hand) {
    const blockEl = renderHandBlock(
      block,
      state.selectedBlock === block.id,
      canSelect
    );

    if (canSelect) {
      blockEl.addEventListener('click', () => onBlockClick(block.id));
    }

    container.appendChild(blockEl);
  }

  return container;
}

/**
 * Render a block in hand
 */
function renderHandBlock(
  block: AttributeBlock,
  isSelected: boolean,
  isClickable: boolean
): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'par55-hand-block';
  if (isSelected) wrapper.classList.add('selected');
  if (isClickable) wrapper.classList.add('clickable');

  const size = 60;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(size));
  svg.setAttribute('height', String(size));
  svg.setAttribute('viewBox', `0 0 ${size} ${size}`);

  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('x', '2');
  bg.setAttribute('y', '2');
  bg.setAttribute('width', String(size - 4));
  bg.setAttribute('height', String(size - 4));
  bg.setAttribute('rx', '6');
  bg.setAttribute('fill', '#f8f8f8');
  bg.setAttribute('stroke', isSelected ? '#ff9800' : '#ccc');
  bg.setAttribute('stroke-width', isSelected ? '3' : '1');
  svg.appendChild(bg);

  // Block shape
  const blockGroup = renderBlock(block, size / 2, size / 2, null);
  svg.appendChild(blockGroup);

  wrapper.appendChild(svg);

  // Label
  const label = document.createElement('div');
  label.className = 'par55-block-label';
  label.textContent = `${block.size[0].toUpperCase()}/${block.thickness[0].toUpperCase()}`;
  wrapper.appendChild(label);

  return wrapper;
}

/**
 * Render scores
 */
export function renderScores(state: Par55State): HTMLElement {
  const container = document.createElement('div');
  container.className = 'par55-scores';

  const p1Score = document.createElement('div');
  p1Score.className = 'par55-score player1';
  p1Score.innerHTML = `<span class="label">Blue:</span> <span class="value">${state.scores.player1}</span>`;

  const target = document.createElement('div');
  target.className = 'par55-target';
  target.textContent = `Target: ${CONFIG.TARGET_SCORE}`;

  const p2Score = document.createElement('div');
  p2Score.className = 'par55-score player2';
  p2Score.innerHTML = `<span class="label">Red:</span> <span class="value">${state.scores.player2}</span>`;

  container.appendChild(p1Score);
  container.appendChild(target);
  container.appendChild(p2Score);

  return container;
}

/**
 * Render move history
 */
export function renderMoveHistory(state: Par55State): HTMLElement {
  const container = document.createElement('div');
  container.className = 'par55-history';

  const title = document.createElement('h4');
  title.textContent = 'Move History';
  container.appendChild(title);

  const list = document.createElement('div');
  list.className = 'par55-history-list';

  // Show last 6 moves
  const recentMoves = state.moveHistory.slice(-6);

  for (const move of recentMoves) {
    const moveEl = document.createElement('div');
    moveEl.className = `par55-history-move ${move.player}`;

    const b = move.block;
    const playerName = move.player === 'player1' ? 'Blue' : 'Red';
    const attrs = `${b.color} ${b.shape}`;
    moveEl.innerHTML = `<strong>${move.moveNumber}.</strong> ${playerName}: ${attrs} (+${move.pointsScored})`;

    list.appendChild(moveEl);
  }

  container.appendChild(list);
  return container;
}

/**
 * Inject CSS styles
 */
export function injectPar55Styles(): void {
  const existingStyle = document.getElementById('par55-styles');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'par55-styles';
  style.textContent = `
    .par55-game-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .par55-main-layout {
      display: flex;
      gap: 2rem;
      align-items: flex-start;
    }

    .par55-board {
      background: #d4edda;
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .par55-svg {
      display: block;
    }

    .par55-valid-base {
      transition: all 0.2s;
    }

    .par55-valid-base:hover {
      fill: #c8e6c9 !important;
    }

    .par55-score-preview {
      pointer-events: none;
    }

    .par55-hand {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
      background: rgba(255,255,255,0.9);
      border-radius: 8px;
      min-width: 100px;
    }

    .par55-hand-player1 {
      border: 3px solid ${PLAYER_COLORS.player1};
    }

    .par55-hand-player2 {
      border: 3px solid ${PLAYER_COLORS.player2};
    }

    .par55-hand-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 4px;
      border-radius: 8px;
      transition: all 0.15s;
    }

    .par55-hand-block.clickable {
      cursor: pointer;
    }

    .par55-hand-block.clickable:hover {
      background: rgba(0,0,0,0.05);
      transform: translateY(-2px);
    }

    .par55-hand-block.selected {
      background: rgba(255,152,0,0.2);
      box-shadow: 0 0 0 2px #ff9800;
    }

    .par55-block-label {
      font-size: 0.7rem;
      color: #666;
      margin-top: 2px;
    }

    .par55-scores {
      display: flex;
      gap: 2rem;
      align-items: center;
      padding: 1rem 2rem;
      background: #333;
      border-radius: 8px;
    }

    .par55-score {
      font-size: 1.2rem;
      font-weight: bold;
    }

    .par55-score.player1 {
      color: ${PLAYER_COLORS.player1};
    }

    .par55-score.player2 {
      color: ${PLAYER_COLORS.player2};
    }

    .par55-score .value {
      font-size: 1.5rem;
    }

    .par55-target {
      color: #999;
      font-size: 0.9rem;
    }

    .par55-status {
      text-align: center;
      padding: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .par55-status.player1 {
      color: ${PLAYER_COLORS.player1};
    }

    .par55-status.player2 {
      color: ${PLAYER_COLORS.player2};
    }

    .par55-winner-banner {
      text-align: center;
      padding: 1.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(135deg, #ffd700, #ffec8b);
      border-radius: 12px;
      margin: 1rem;
      animation: par55-glow 1s ease-in-out infinite alternate;
    }

    @keyframes par55-glow {
      from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }
      to { box-shadow: 0 0 20px rgba(255,215,0,0.8); }
    }

    .par55-controls {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .par55-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
    }

    .par55-btn-primary {
      background: linear-gradient(135deg, #2196f3, #1976d2);
      color: white;
    }

    .par55-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(33,150,243,0.3);
    }

    .par55-btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .par55-btn-secondary:hover {
      background: #bdbdbd;
    }

    .par55-history {
      background: rgba(0,0,0,0.05);
      padding: 1rem;
      border-radius: 8px;
      max-width: 200px;
    }

    .par55-history h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      color: #666;
    }

    .par55-history-list {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.8rem;
    }

    .par55-history-move {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .par55-history-move.player1 {
      background: rgba(33,150,243,0.1);
    }

    .par55-history-move.player2 {
      background: rgba(244,67,54,0.1);
    }

    .par55-hand-label {
      font-weight: bold;
      margin-bottom: 0.5rem;
      text-align: center;
    }

    .par55-hand-label.player1 {
      color: ${PLAYER_COLORS.player1};
    }

    .par55-hand-label.player2 {
      color: ${PLAYER_COLORS.player2};
    }

    @media (max-width: 768px) {
      .par55-main-layout {
        flex-direction: column;
        align-items: center;
      }

      .par55-hand {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
      }
    }
  `;
  document.head.appendChild(style);
}

/**
 * Get player display name
 */
export function getPlayerName(player: Player): string {
  return player === 'player1' ? 'Blue' : 'Red';
}
