// Pent'Em In Board UI
// Renders the game board, pieces, and piece selector

import {
  PentEmInState,
  BOARD_SIZE,
  getPlayerPieces,
  getPentominoShape,
} from './types';
import { getPieceCells, canPlacePiece } from './rules';
import { Cell } from '../../core/polyomino/types';
import { normalizeCells } from '../../core/polyomino/transform';

const CELL_SIZE = 36;
const PREVIEW_CELL_SIZE = 16;
const BOARD_PADDING = 20;

// Player colors
const PLAYER_COLORS = {
  player1: '#2196F3',  // Blue
  player2: '#e53935',  // Red
};

// =============================================================================
// Board Rendering
// =============================================================================

export function renderBoard(
  state: PentEmInState,
  onCellClick: (cell: Cell) => void,
  onCellHover: (cell: Cell | null) => void
): SVGElement {
  const width = BOARD_SIZE * CELL_SIZE + BOARD_PADDING * 2;
  const height = BOARD_SIZE * CELL_SIZE + BOARD_PADDING * 2;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.classList.add('pent-board');

  // Background
  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  bg.setAttribute('width', String(width));
  bg.setAttribute('height', String(height));
  bg.setAttribute('fill', '#f5f5f5');
  svg.appendChild(bg);

  // Grid lines
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gridGroup.classList.add('grid-lines');

  for (let i = 0; i <= BOARD_SIZE; i++) {
    // Horizontal lines
    const hLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hLine.setAttribute('x1', String(BOARD_PADDING));
    hLine.setAttribute('y1', String(BOARD_PADDING + i * CELL_SIZE));
    hLine.setAttribute('x2', String(BOARD_PADDING + BOARD_SIZE * CELL_SIZE));
    hLine.setAttribute('y2', String(BOARD_PADDING + i * CELL_SIZE));
    hLine.setAttribute('stroke', '#bbb');
    hLine.setAttribute('stroke-width', '1');
    gridGroup.appendChild(hLine);

    // Vertical lines
    const vLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    vLine.setAttribute('x1', String(BOARD_PADDING + i * CELL_SIZE));
    vLine.setAttribute('y1', String(BOARD_PADDING));
    vLine.setAttribute('x2', String(BOARD_PADDING + i * CELL_SIZE));
    vLine.setAttribute('y2', String(BOARD_PADDING + BOARD_SIZE * CELL_SIZE));
    vLine.setAttribute('stroke', '#bbb');
    vLine.setAttribute('stroke-width', '1');
    gridGroup.appendChild(vLine);
  }
  svg.appendChild(gridGroup);

  // Placed pieces
  const piecesGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  piecesGroup.classList.add('placed-pieces');

  for (const piece of state.placedPieces) {
    const shape = getPentominoShape(piece.shapeId);
    if (!shape) continue;

    for (const cell of piece.cells) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(BOARD_PADDING + cell.col * CELL_SIZE + 1));
      rect.setAttribute('y', String(BOARD_PADDING + cell.row * CELL_SIZE + 1));
      rect.setAttribute('width', String(CELL_SIZE - 2));
      rect.setAttribute('height', String(CELL_SIZE - 2));
      rect.setAttribute('fill', PLAYER_COLORS[piece.player]);
      rect.setAttribute('rx', '3');
      rect.setAttribute('opacity', '0.9');
      piecesGroup.appendChild(rect);

      // Add piece label on first cell
      if (cell === piece.cells[0]) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', String(BOARD_PADDING + cell.col * CELL_SIZE + CELL_SIZE / 2));
        text.setAttribute('y', String(BOARD_PADDING + cell.row * CELL_SIZE + CELL_SIZE / 2 + 4));
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-size', '12');
        text.setAttribute('font-weight', 'bold');
        text.textContent = piece.shapeId;
        piecesGroup.appendChild(text);
      }
    }
  }
  svg.appendChild(piecesGroup);

  // Preview (if placing)
  if (state.selectedPiece && state.previewPosition) {
    const previewCells = getPieceCells(
      state.selectedPiece,
      state.previewPosition,
      state.selectedRotation,
      state.selectedFlipped
    );

    const isValid = canPlacePiece(
      state,
      state.selectedPiece,
      state.previewPosition,
      state.selectedRotation,
      state.selectedFlipped
    );

    const previewGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    previewGroup.classList.add('preview');

    for (const cell of previewCells) {
      if (cell.row < 0 || cell.row >= BOARD_SIZE || cell.col < 0 || cell.col >= BOARD_SIZE) {
        continue;
      }

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(BOARD_PADDING + cell.col * CELL_SIZE + 1));
      rect.setAttribute('y', String(BOARD_PADDING + cell.row * CELL_SIZE + 1));
      rect.setAttribute('width', String(CELL_SIZE - 2));
      rect.setAttribute('height', String(CELL_SIZE - 2));
      rect.setAttribute('fill', isValid ? PLAYER_COLORS[state.currentPlayer] : '#ff5252');
      rect.setAttribute('rx', '3');
      rect.setAttribute('opacity', '0.5');
      previewGroup.appendChild(rect);
    }
    svg.appendChild(previewGroup);
  }

  // Click/hover areas
  const interactionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  interactionGroup.classList.add('interaction');

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(BOARD_PADDING + col * CELL_SIZE));
      rect.setAttribute('y', String(BOARD_PADDING + row * CELL_SIZE));
      rect.setAttribute('width', String(CELL_SIZE));
      rect.setAttribute('height', String(CELL_SIZE));
      rect.setAttribute('fill', 'transparent');
      rect.style.cursor = 'pointer';

      rect.addEventListener('click', () => onCellClick({ row, col }));
      rect.addEventListener('mouseenter', () => onCellHover({ row, col }));
      rect.addEventListener('mouseleave', () => onCellHover(null));

      interactionGroup.appendChild(rect);
    }
  }
  svg.appendChild(interactionGroup);

  return svg;
}

// =============================================================================
// Piece Selector Rendering
// =============================================================================

export function renderPieceSelector(
  state: PentEmInState,
  onPieceSelect: (shapeId: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'pent-piece-selector';

  const pieces = getPlayerPieces(state, state.currentPlayer);
  const playerColor = PLAYER_COLORS[state.currentPlayer];

  for (const shapeId of pieces.available) {
    const shape = getPentominoShape(shapeId);
    if (!shape) continue;

    const pieceEl = document.createElement('div');
    pieceEl.className = `pent-piece-option ${state.selectedPiece === shapeId ? 'selected' : ''}`;
    pieceEl.style.border = state.selectedPiece === shapeId ? `2px solid ${playerColor}` : '2px solid #ddd';

    // Mini SVG preview
    const cells = normalizeCells(shape.cells);
    const maxRow = Math.max(...cells.map(c => c.row)) + 1;
    const maxCol = Math.max(...cells.map(c => c.col)) + 1;

    const svgWidth = maxCol * PREVIEW_CELL_SIZE + 4;
    const svgHeight = maxRow * PREVIEW_CELL_SIZE + 4;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', String(Math.max(svgWidth, 50)));
    svg.setAttribute('height', String(Math.max(svgHeight, 50)));

    for (const cell of cells) {
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', String(2 + cell.col * PREVIEW_CELL_SIZE));
      rect.setAttribute('y', String(2 + cell.row * PREVIEW_CELL_SIZE));
      rect.setAttribute('width', String(PREVIEW_CELL_SIZE - 1));
      rect.setAttribute('height', String(PREVIEW_CELL_SIZE - 1));
      rect.setAttribute('fill', playerColor);
      rect.setAttribute('rx', '2');
      svg.appendChild(rect);
    }

    pieceEl.appendChild(svg);

    // Label
    const label = document.createElement('div');
    label.className = 'pent-piece-label';
    label.textContent = shapeId;
    pieceEl.appendChild(label);

    pieceEl.addEventListener('click', () => onPieceSelect(shapeId));
    container.appendChild(pieceEl);
  }

  return container;
}

// =============================================================================
// Status and Controls
// =============================================================================

export function getPlayerName(player: 'player1' | 'player2'): string {
  return player === 'player1' ? 'Blue' : 'Red';
}

export function injectPentEmInStyles(): void {
  if (document.getElementById('pent-em-in-styles')) return;

  const style = document.createElement('style');
  style.id = 'pent-em-in-styles';
  style.textContent = `
    .pent-game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 16px;
    }

    .pent-board {
      border: 2px solid #333;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .pent-piece-selector {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      max-width: 600px;
      padding: 12px;
      background: #f9f9f9;
      border-radius: 8px;
    }

    .pent-piece-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 6px;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pent-piece-option:hover {
      transform: scale(1.05);
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }

    .pent-piece-option.selected {
      background: #e3f2fd;
    }

    .pent-piece-label {
      font-size: 12px;
      font-weight: bold;
      color: #666;
      margin-top: 4px;
    }

    .pent-status {
      font-size: 18px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
    }

    .pent-status.player1 {
      background: #e3f2fd;
      color: #1565c0;
    }

    .pent-status.player2 {
      background: #ffebee;
      color: #c62828;
    }

    .pent-winner-banner {
      font-size: 24px;
      font-weight: bold;
      padding: 16px 24px;
      background: linear-gradient(135deg, #ffd700, #ffb700);
      color: #333;
      border-radius: 12px;
      text-align: center;
    }

    .pent-controls {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .pent-btn {
      padding: 8px 16px;
      font-size: 14px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pent-btn-rotate {
      background: #7c4dff;
      color: white;
    }

    .pent-btn-flip {
      background: #00bcd4;
      color: white;
    }

    .pent-btn-cancel {
      background: #9e9e9e;
      color: white;
    }

    .pent-btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .pent-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .pent-instructions {
      font-size: 14px;
      color: #666;
      text-align: center;
      max-width: 400px;
    }
  `;
  document.head.appendChild(style);
}
