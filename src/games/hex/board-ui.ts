// Hex Board UI - Renders the hexagonal game board

import { HexGameState, HexPosition } from './types';
import { getWinningPath } from './rules';

export type CellClickCallback = (row: number, col: number) => void;

// Render the hex board as an SVG
export function renderBoard(
  state: HexGameState,
  container: HTMLElement,
  onCellClick?: CellClickCallback
): void {
  container.innerHTML = '';

  const size = state.boardSize;

  // Calculate SVG dimensions
  // Hex dimensions (pointy-top hexagons)
  const hexRadius = 22; // Size of each hex
  const hexWidth = hexRadius * Math.sqrt(3);
  const hexHeight = hexRadius * 2;
  const vertSpacing = hexHeight * 0.75;
  const horizSpacing = hexWidth;

  // Board dimensions with padding for edge colors
  const padding = 40;
  const boardWidth = (size - 1) * horizSpacing + (size - 1) * (hexWidth / 2) + hexWidth + padding * 2;
  const boardHeight = (size - 1) * vertSpacing + hexHeight + padding * 2;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'hex-board');
  svg.setAttribute('viewBox', `0 0 ${boardWidth} ${boardHeight}`);
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');

  // Create defs for hex shape
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

  // Pointy-top hexagon path
  const hexPoints = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = hexRadius * Math.cos(angle);
    const y = hexRadius * Math.sin(angle);
    hexPoints.push(`${x},${y}`);
  }
  const hexPath = hexPoints.join(' ');

  // Create hex symbol
  const hexSymbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
  hexSymbol.setAttribute('id', 'hex-cell');
  hexSymbol.setAttribute('viewBox', `${-hexRadius} ${-hexRadius} ${hexRadius * 2} ${hexRadius * 2}`);
  const hexPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  hexPolygon.setAttribute('points', hexPath);
  hexSymbol.appendChild(hexPolygon);
  defs.appendChild(hexSymbol);

  svg.appendChild(defs);

  // Draw edge indicators (colored borders showing which player connects which sides)
  const edgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  edgeGroup.setAttribute('class', 'hex-edges');

  // Calculate hex center positions
  const getHexCenter = (row: number, col: number): { x: number; y: number } => {
    const x = padding + hexWidth / 2 + col * horizSpacing + row * (hexWidth / 2);
    const y = padding + hexRadius + row * vertSpacing;
    return { x, y };
  };

  // Draw top edge (Player 1 - Blue)
  const topEdgePath = [];
  for (let col = 0; col < size; col++) {
    const center = getHexCenter(0, col);
    if (col === 0) {
      topEdgePath.push(`M ${center.x - hexWidth / 2} ${center.y - hexRadius}`);
    }
    topEdgePath.push(`L ${center.x} ${center.y - hexRadius}`);
    topEdgePath.push(`L ${center.x + hexWidth / 2} ${center.y - hexRadius}`);
  }
  const topEdge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  topEdge.setAttribute('d', topEdgePath.join(' '));
  topEdge.setAttribute('class', 'hex-edge hex-edge-p1');
  edgeGroup.appendChild(topEdge);

  // Draw bottom edge (Player 1 - Blue)
  const bottomEdgePath = [];
  for (let col = 0; col < size; col++) {
    const center = getHexCenter(size - 1, col);
    if (col === 0) {
      bottomEdgePath.push(`M ${center.x - hexWidth / 2} ${center.y + hexRadius}`);
    }
    bottomEdgePath.push(`L ${center.x} ${center.y + hexRadius}`);
    bottomEdgePath.push(`L ${center.x + hexWidth / 2} ${center.y + hexRadius}`);
  }
  const bottomEdge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  bottomEdge.setAttribute('d', bottomEdgePath.join(' '));
  bottomEdge.setAttribute('class', 'hex-edge hex-edge-p1');
  edgeGroup.appendChild(bottomEdge);

  // Draw left edge (Player 2 - Red)
  const leftEdgePath = [];
  for (let row = 0; row < size; row++) {
    const center = getHexCenter(row, 0);
    if (row === 0) {
      leftEdgePath.push(`M ${center.x - hexWidth / 2} ${center.y - hexRadius}`);
    }
    leftEdgePath.push(`L ${center.x - hexWidth / 2} ${center.y}`);
    leftEdgePath.push(`L ${center.x - hexWidth / 2 + (hexWidth / 2) / 2} ${center.y + hexRadius * 0.75}`);
  }
  // Connect to bottom-left corner
  const blCorner = getHexCenter(size - 1, 0);
  leftEdgePath.push(`L ${blCorner.x - hexWidth / 2} ${blCorner.y + hexRadius}`);

  const leftEdge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  leftEdge.setAttribute('d', leftEdgePath.join(' '));
  leftEdge.setAttribute('class', 'hex-edge hex-edge-p2');
  edgeGroup.appendChild(leftEdge);

  // Draw right edge (Player 2 - Red)
  const rightEdgePath = [];
  for (let row = 0; row < size; row++) {
    const center = getHexCenter(row, size - 1);
    if (row === 0) {
      rightEdgePath.push(`M ${center.x + hexWidth / 2} ${center.y - hexRadius}`);
    }
    rightEdgePath.push(`L ${center.x + hexWidth / 2} ${center.y}`);
    rightEdgePath.push(`L ${center.x + hexWidth / 2 - (hexWidth / 2) / 2} ${center.y + hexRadius * 0.75}`);
  }
  const brCorner = getHexCenter(size - 1, size - 1);
  rightEdgePath.push(`L ${brCorner.x + hexWidth / 2} ${brCorner.y + hexRadius}`);

  const rightEdge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  rightEdge.setAttribute('d', rightEdgePath.join(' '));
  rightEdge.setAttribute('class', 'hex-edge hex-edge-p2');
  edgeGroup.appendChild(rightEdge);

  svg.appendChild(edgeGroup);

  // Get winning path for highlighting
  const winningPath = state.winner
    ? getWinningPath(state.board, state.winner, state.boardSize)
    : [];
  const winningSet = new Set(winningPath.map((p) => `${p.row},${p.col}`));

  // Draw hex cells
  const cellsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  cellsGroup.setAttribute('class', 'hex-cells');

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const center = getHexCenter(row, col);
      const cellState = state.board[row][col];
      const isWinningCell = winningSet.has(`${row},${col}`);

      const cellGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      cellGroup.setAttribute('class', 'hex-cell-group');
      cellGroup.setAttribute('transform', `translate(${center.x}, ${center.y})`);
      cellGroup.setAttribute('data-row', String(row));
      cellGroup.setAttribute('data-col', String(col));

      // Draw hex
      const hex = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      hex.setAttribute('points', hexPath);

      let cellClass = 'hex-cell';
      if (cellState === 'player1') {
        cellClass += ' hex-cell-p1';
      } else if (cellState === 'player2') {
        cellClass += ' hex-cell-p2';
      } else {
        cellClass += ' hex-cell-empty';
      }

      if (isWinningCell) {
        cellClass += ' hex-cell-winning';
      }

      // Mark last move
      if (state.moveHistory.length > 0) {
        const lastMove = state.moveHistory[state.moveHistory.length - 1];
        if (lastMove.position.row === row && lastMove.position.col === col) {
          cellClass += ' hex-cell-last-move';
        }
      }

      hex.setAttribute('class', cellClass);
      cellGroup.appendChild(hex);

      // Add click handler
      if (onCellClick && cellState === null && state.winner === null) {
        cellGroup.style.cursor = 'pointer';
        cellGroup.addEventListener('click', () => onCellClick(row, col));
      }

      cellsGroup.appendChild(cellGroup);
    }
  }

  svg.appendChild(cellsGroup);

  // Add coordinate labels (optional, for reference)
  const labelsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  labelsGroup.setAttribute('class', 'hex-labels');

  // Column labels (A-K for 11x11)
  for (let col = 0; col < size; col++) {
    const center = getHexCenter(0, col);
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', String(center.x));
    label.setAttribute('y', String(center.y - hexRadius - 8));
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('class', 'hex-label');
    label.textContent = String.fromCharCode(65 + col);
    labelsGroup.appendChild(label);
  }

  // Row labels (1-11)
  for (let row = 0; row < size; row++) {
    const center = getHexCenter(row, 0);
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', String(center.x - hexWidth / 2 - 12));
    label.setAttribute('y', String(center.y + 4));
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('class', 'hex-label');
    label.textContent = String(row + 1);
    labelsGroup.appendChild(label);
  }

  svg.appendChild(labelsGroup);

  container.appendChild(svg);
}

// Render game status
export function renderStatus(
  state: HexGameState,
  container: HTMLElement,
  gameMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human',
  isAIThinking: boolean = false
): void {
  container.innerHTML = '';

  const statusEl = document.createElement('div');
  statusEl.className = 'hex-status';

  // Game mode indicator
  if (gameMode === 'human-vs-ai') {
    const modeEl = document.createElement('div');
    modeEl.className = 'status-mode';
    modeEl.textContent = 'vs AI';
    statusEl.appendChild(modeEl);
  }

  // Turn indicator
  const turnEl = document.createElement('div');
  turnEl.className = 'status-turn';

  if (state.winner) {
    turnEl.classList.add('status-winner');
    const winnerName =
      gameMode === 'human-vs-ai'
        ? state.winner === 'player1'
          ? 'You'
          : 'AI'
        : state.winner === 'player1'
          ? 'Blue'
          : 'Red';
    const winnerIcon = state.winner === 'player1' ? '🔵' : '🔴';
    turnEl.textContent = `${winnerIcon} ${winnerName} Win${winnerName === 'You' ? '' : 's'}!`;
  } else if (isAIThinking) {
    turnEl.textContent = '🤖 AI is thinking...';
    turnEl.classList.add('status-ai-thinking');
  } else {
    const playerName =
      gameMode === 'human-vs-ai'
        ? state.currentPlayer === 'player1'
          ? 'Your'
          : "AI's"
        : state.currentPlayer === 'player1'
          ? "Blue's"
          : "Red's";
    turnEl.textContent = `${playerName} turn - Click to place`;
  }

  statusEl.appendChild(turnEl);

  // Move count
  const moveCountEl = document.createElement('div');
  moveCountEl.className = 'hex-move-count';
  moveCountEl.textContent = `Move ${state.moveHistory.length + 1}`;
  statusEl.appendChild(moveCountEl);

  // Player legend
  const legendEl = document.createElement('div');
  legendEl.className = 'hex-legend';
  legendEl.innerHTML = `
    <span class="hex-legend-item hex-legend-p1">🔵 Blue: Top ↔ Bottom</span>
    <span class="hex-legend-item hex-legend-p2">🔴 Red: Left ↔ Right</span>
  `;
  statusEl.appendChild(legendEl);

  container.appendChild(statusEl);
}

// Format position as coordinate string (e.g., "A1", "K11")
export function formatPosition(pos: HexPosition): string {
  const colLetter = String.fromCharCode(65 + pos.col);
  return `${colLetter}${pos.row + 1}`;
}
