// Kwatro-Sinko Board UI
// Rendering the pathway board, chips, and game state

import {
  KwaState,
  BoardNode,
  Chip,
  Player,
} from './types';
import { getValidMoves } from './rules';

// Dimensions
const NODE_RADIUS = 22;
const CHIP_RADIUS = 18;

// Colors
const PLAYER_COLORS = {
  player1: '#2196f3',
  player2: '#f44336',
};

/**
 * Render the game board
 */
export function renderBoard(
  state: KwaState,
  onNodeClick: (nodeId: string) => void,
  onChipClick: (chipId: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'kwa-board';

  // Calculate board size
  const svgWidth = 420;
  const svgHeight = 420;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(svgWidth));
  svg.setAttribute('height', String(svgHeight));
  svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
  svg.classList.add('kwa-svg');

  // Get valid moves for selected chip
  const validMoves = state.selectedChip
    ? new Set(getValidMoves(state, state.selectedChip))
    : new Set<string>();

  // Draw connections first (underneath nodes)
  for (const node of state.nodes.values()) {
    for (const connId of node.connections) {
      const connNode = state.nodes.get(connId);
      if (connNode && connId > node.id) { // Only draw each line once
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(node.x));
        line.setAttribute('y1', String(node.y));
        line.setAttribute('x2', String(connNode.x));
        line.setAttribute('y2', String(connNode.y));
        line.setAttribute('stroke', '#999');
        line.setAttribute('stroke-width', '2');
        svg.appendChild(line);
      }
    }
  }

  // Draw nodes
  for (const node of state.nodes.values()) {
    const isValid = validMoves.has(node.id);
    const isWinning = state.winningAlignment?.nodes.includes(node.id) ?? false;
    const nodeGroup = renderNode(state, node, isValid, isWinning, onNodeClick, onChipClick);
    svg.appendChild(nodeGroup);
  }

  container.appendChild(svg);
  return container;
}

/**
 * Render a single node
 */
function renderNode(
  state: KwaState,
  node: BoardNode,
  isValid: boolean,
  isWinning: boolean,
  onNodeClick: (nodeId: string) => void,
  onChipClick: (chipId: string) => void
): SVGGElement {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // Node circle
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', String(node.x));
  circle.setAttribute('cy', String(node.y));
  circle.setAttribute('r', String(NODE_RADIUS));

  if (isWinning) {
    circle.setAttribute('fill', '#ffd700');
    circle.setAttribute('stroke', '#ff9800');
    circle.setAttribute('stroke-width', '3');
  } else if (isValid) {
    circle.setAttribute('fill', '#c8e6c9');
    circle.setAttribute('stroke', '#4caf50');
    circle.setAttribute('stroke-width', '3');
    circle.style.cursor = 'pointer';
    circle.classList.add('kwa-valid-node');
  } else if (node.isNumbered) {
    circle.setAttribute('fill', '#e8e8e8');
    circle.setAttribute('stroke', '#999');
    circle.setAttribute('stroke-width', '2');
  } else {
    circle.setAttribute('fill', '#f5f5f5');
    circle.setAttribute('stroke', '#ccc');
    circle.setAttribute('stroke-width', '1');
  }

  group.appendChild(circle);

  // Click handler for valid moves
  if (isValid && !node.chip) {
    group.addEventListener('click', () => onNodeClick(node.id));
  }

  // Render chip if present
  if (node.chip) {
    const isSelected = state.selectedChip === node.chip.id;
    const canSelect = state.phase === 'selectingChip' && node.chip.owner === state.currentPlayer;
    const chipGroup = renderChip(node.chip, node.x, node.y, isSelected, canSelect, onChipClick);
    group.appendChild(chipGroup);
  }

  return group;
}

/**
 * Render a chip
 */
function renderChip(
  chip: Chip,
  cx: number,
  cy: number,
  isSelected: boolean,
  canSelect: boolean,
  onClick: (chipId: string) => void
): SVGGElement {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // Selection ring
  if (isSelected) {
    const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ring.setAttribute('cx', String(cx));
    ring.setAttribute('cy', String(cy));
    ring.setAttribute('r', String(CHIP_RADIUS + 4));
    ring.setAttribute('fill', 'none');
    ring.setAttribute('stroke', '#ff9800');
    ring.setAttribute('stroke-width', '3');
    group.appendChild(ring);
  }

  // Chip circle
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', String(cx));
  circle.setAttribute('cy', String(cy));
  circle.setAttribute('r', String(CHIP_RADIUS));
  circle.setAttribute('fill', PLAYER_COLORS[chip.owner]);
  circle.setAttribute('stroke', '#333');
  circle.setAttribute('stroke-width', '2');

  if (canSelect) {
    circle.style.cursor = 'pointer';
    circle.classList.add('kwa-selectable-chip');
  }

  group.appendChild(circle);

  // Chip value
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', String(cx));
  text.setAttribute('y', String(cy + 5));
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('font-size', '16');
  text.setAttribute('font-weight', 'bold');
  text.setAttribute('fill', '#fff');
  text.textContent = String(chip.value);
  group.appendChild(text);

  // Click handler
  if (canSelect) {
    group.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick(chip.id);
    });
  }

  return group;
}

/**
 * Render scores/chip counts
 */
export function renderChipInfo(_state: KwaState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'kwa-chip-info';

  const p1Info = document.createElement('div');
  p1Info.className = 'kwa-player-info player1';
  p1Info.innerHTML = `<span class="label">Blue (Even):</span> 0, 2, 4, 6, 8`;

  const p2Info = document.createElement('div');
  p2Info.className = 'kwa-player-info player2';
  p2Info.innerHTML = `<span class="label">Red (Odd):</span> 1, 3, 5, 7, 9`;

  container.appendChild(p1Info);
  container.appendChild(p2Info);

  return container;
}

/**
 * Render move history
 */
export function renderMoveHistory(state: KwaState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'kwa-history';

  const title = document.createElement('h4');
  title.textContent = 'Move History';
  container.appendChild(title);

  const list = document.createElement('div');
  list.className = 'kwa-history-list';

  // Show last 6 moves
  const recentMoves = state.moveHistory.slice(-6);

  for (const move of recentMoves) {
    const moveEl = document.createElement('div');
    moveEl.className = `kwa-history-move ${move.player}`;

    const playerName = move.player === 'player1' ? 'Blue' : 'Red';
    const alignInfo = move.alignment ? ` → ${move.alignment.expression}` : '';
    moveEl.innerHTML = `<strong>${move.moveNumber}.</strong> ${playerName}: ${move.chip.value}${alignInfo}`;

    list.appendChild(moveEl);
  }

  container.appendChild(list);
  return container;
}

/**
 * Inject CSS styles
 */
export function injectKwaStyles(): void {
  const existingStyle = document.getElementById('kwa-styles');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'kwa-styles';
  style.textContent = `
    .kwa-game-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .kwa-main-layout {
      display: flex;
      gap: 2rem;
      align-items: flex-start;
    }

    .kwa-board {
      background: linear-gradient(135deg, #e8d4b8, #d4c4a8);
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .kwa-svg {
      display: block;
    }

    .kwa-valid-node {
      transition: all 0.2s;
    }

    .kwa-valid-node:hover {
      fill: #a5d6a7 !important;
    }

    .kwa-selectable-chip {
      transition: all 0.15s;
    }

    .kwa-selectable-chip:hover {
      transform: scale(1.1);
      filter: brightness(1.1);
    }

    .kwa-chip-info {
      display: flex;
      gap: 2rem;
      padding: 1rem 2rem;
      background: #333;
      border-radius: 8px;
    }

    .kwa-player-info {
      font-size: 0.9rem;
    }

    .kwa-player-info.player1 {
      color: ${PLAYER_COLORS.player1};
    }

    .kwa-player-info.player2 {
      color: ${PLAYER_COLORS.player2};
    }

    .kwa-status {
      text-align: center;
      padding: 1rem;
      font-size: 1.2rem;
      font-weight: 500;
    }

    .kwa-status.player1 {
      color: ${PLAYER_COLORS.player1};
    }

    .kwa-status.player2 {
      color: ${PLAYER_COLORS.player2};
    }

    .kwa-winner-banner {
      text-align: center;
      padding: 1.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(135deg, #ffd700, #ffec8b);
      border-radius: 12px;
      margin: 1rem;
      animation: kwa-glow 1s ease-in-out infinite alternate;
    }

    @keyframes kwa-glow {
      from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }
      to { box-shadow: 0 0 20px rgba(255,215,0,0.8); }
    }

    .kwa-winning-expr {
      text-align: center;
      font-size: 1.3rem;
      font-weight: bold;
      color: #333;
      padding: 0.5rem 1rem;
      background: rgba(255,215,0,0.3);
      border-radius: 8px;
    }

    .kwa-controls {
      display: flex;
      gap: 1rem;
      justify-content: center;
    }

    .kwa-btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s;
    }

    .kwa-btn-primary {
      background: linear-gradient(135deg, #2196f3, #1976d2);
      color: white;
    }

    .kwa-btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(33,150,243,0.3);
    }

    .kwa-btn-secondary {
      background: #e0e0e0;
      color: #333;
    }

    .kwa-btn-secondary:hover {
      background: #bdbdbd;
    }

    .kwa-history {
      background: rgba(0,0,0,0.05);
      padding: 1rem;
      border-radius: 8px;
      max-width: 250px;
    }

    .kwa-history h4 {
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      color: #666;
    }

    .kwa-history-list {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.8rem;
    }

    .kwa-history-move {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .kwa-history-move.player1 {
      background: rgba(33,150,243,0.1);
    }

    .kwa-history-move.player2 {
      background: rgba(244,67,54,0.1);
    }

    .kwa-target-info {
      text-align: center;
      padding: 0.5rem 1rem;
      background: #f5f5f5;
      border-radius: 8px;
      font-size: 0.9rem;
      color: #666;
    }

    .kwa-target-info strong {
      color: #333;
    }

    @media (max-width: 768px) {
      .kwa-main-layout {
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
export function getPlayerName(player: Player): string {
  return player === 'player1' ? 'Blue' : 'Red';
}
