// Hex Board UI - Renders the hexagonal game board

import type { HexGameState, HexPosition } from './types';
import { getWinningPath } from './rules';
import { getGameModeChromeRoot, seatIcon } from '../../ui/player-colors';
import { pointyTopHexPolygonPoints } from '../../ui/hex-svg';
import {
  clearElement,
  replaceWithSafeHtml,
  safeHtml,
} from '../../core/dom-security';
import {
  buildCellAriaLabel,
  makeGridCell,
  markBoardAsGrid,
  bindGridNavigation,
  captureFocusedCell,
  restoreGridFocus,
  markStatusLive,
} from '../../ui/board-a11y';

export type CellClickCallback = (row: number, col: number) => void;

interface HexBoardBinding {
  onCellClick?: CellClickCallback | undefined;
}

interface HexBoardCache {
  svg: SVGSVGElement;
  cells: SVGGElement[];
  size: number;
  hexPath: string;
}

const hexClickBindings = new WeakMap<HTMLElement, HexBoardBinding>();
const hexBoardCaches = new WeakMap<HTMLElement, HexBoardCache>();

/** True when vs-AI chrome is on and it is the computer's seat to place. */
function isComputerPlacementTurn(state: HexGameState): boolean {
  const root = getGameModeChromeRoot();
  if (root?.dataset.opponent !== 'ai') return false;
  const aiSeat = root.dataset.aiSeat === 'player1' ? 'player1' : 'player2';
  return state.currentPlayer === aiSeat;
}

function hexLayout(size: number) {
  // Hex dimensions (pointy-top hexagons).
  // Radius 26 → flat-to-flat ≈45.0 and point-to-point 52 (≥44 CSS px at scale 1).
  const hexRadius = 26;
  const hexWidth = hexRadius * Math.sqrt(3);
  const hexHeight = hexRadius * 2;
  const vertSpacing = hexHeight * 0.75;
  const horizSpacing = hexWidth;
  const padding = 40;
  const boardWidth =
    (size - 1) * horizSpacing +
    (size - 1) * (hexWidth / 2) +
    hexWidth +
    padding * 2;
  const boardHeight = (size - 1) * vertSpacing + hexHeight + padding * 2;
  const hexPath = pointyTopHexPolygonPoints(0, 0, hexRadius);
  const getHexCenter = (row: number, col: number): { x: number; y: number } => {
    const x =
      padding + hexWidth / 2 + col * horizSpacing + row * (hexWidth / 2);
    const y = padding + hexRadius + row * vertSpacing;
    return { x, y };
  };
  return {
    hexRadius,
    hexWidth,
    hexHeight,
    padding,
    boardWidth,
    boardHeight,
    hexPath,
    getHexCenter,
  };
}

function ensureHexBoard(container: HTMLElement, size: number): HexBoardCache {
  const existing = hexBoardCaches.get(container);
  if (existing && existing.size === size && container.contains(existing.svg)) {
    return existing;
  }

  container.replaceChildren();
  const layout = hexLayout(size);
  const {
    hexRadius,
    hexWidth,
    boardWidth,
    boardHeight,
    hexPath,
    getHexCenter,
  } = layout;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'hex-board');
  svg.setAttribute('viewBox', `0 0 ${boardWidth} ${boardHeight}`);
  svg.setAttribute('width', String(Math.round(boardWidth)));
  svg.setAttribute('height', String(Math.round(boardHeight)));
  markBoardAsGrid(svg);

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const hexSymbol = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'symbol'
  );
  hexSymbol.setAttribute('id', 'hex-cell');
  hexSymbol.setAttribute(
    'viewBox',
    `${-hexRadius} ${-hexRadius} ${hexRadius * 2} ${hexRadius * 2}`
  );
  const hexPolygon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'polygon'
  );
  hexPolygon.setAttribute('points', hexPath);
  hexSymbol.appendChild(hexPolygon);
  defs.appendChild(hexSymbol);
  svg.appendChild(defs);

  const edgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  edgeGroup.setAttribute('class', 'hex-edges');

  const topEdgePath: string[] = [];
  for (let col = 0; col < size; col++) {
    const center = getHexCenter(0, col);
    if (col === 0) {
      topEdgePath.push(`M ${center.x - hexWidth / 2} ${center.y - hexRadius}`);
    }
    topEdgePath.push(`L ${center.x} ${center.y - hexRadius}`);
    topEdgePath.push(`L ${center.x + hexWidth / 2} ${center.y - hexRadius}`);
  }
  const topEdge = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  topEdge.setAttribute('d', topEdgePath.join(' '));
  topEdge.setAttribute('class', 'hex-edge hex-edge-p1');
  edgeGroup.appendChild(topEdge);

  const bottomEdgePath: string[] = [];
  for (let col = 0; col < size; col++) {
    const center = getHexCenter(size - 1, col);
    if (col === 0) {
      bottomEdgePath.push(
        `M ${center.x - hexWidth / 2} ${center.y + hexRadius}`
      );
    }
    bottomEdgePath.push(`L ${center.x} ${center.y + hexRadius}`);
    bottomEdgePath.push(`L ${center.x + hexWidth / 2} ${center.y + hexRadius}`);
  }
  const bottomEdge = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  bottomEdge.setAttribute('d', bottomEdgePath.join(' '));
  bottomEdge.setAttribute('class', 'hex-edge hex-edge-p1');
  edgeGroup.appendChild(bottomEdge);

  const leftEdgePath: string[] = [];
  for (let row = 0; row < size; row++) {
    const center = getHexCenter(row, 0);
    if (row === 0) {
      leftEdgePath.push(`M ${center.x - hexWidth / 2} ${center.y - hexRadius}`);
    }
    leftEdgePath.push(`L ${center.x - hexWidth / 2} ${center.y}`);
    leftEdgePath.push(
      `L ${center.x - hexWidth / 2 + hexWidth / 2 / 2} ${center.y + hexRadius * 0.75}`
    );
  }
  const blCorner = getHexCenter(size - 1, 0);
  leftEdgePath.push(`L ${blCorner.x - hexWidth / 2} ${blCorner.y + hexRadius}`);
  const leftEdge = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  leftEdge.setAttribute('d', leftEdgePath.join(' '));
  leftEdge.setAttribute('class', 'hex-edge hex-edge-p2');
  edgeGroup.appendChild(leftEdge);

  const rightEdgePath: string[] = [];
  for (let row = 0; row < size; row++) {
    const center = getHexCenter(row, size - 1);
    if (row === 0) {
      rightEdgePath.push(
        `M ${center.x + hexWidth / 2} ${center.y - hexRadius}`
      );
    }
    rightEdgePath.push(`L ${center.x + hexWidth / 2} ${center.y}`);
    rightEdgePath.push(
      `L ${center.x + hexWidth / 2 - hexWidth / 2 / 2} ${center.y + hexRadius * 0.75}`
    );
  }
  const brCorner = getHexCenter(size - 1, size - 1);
  rightEdgePath.push(
    `L ${brCorner.x + hexWidth / 2} ${brCorner.y + hexRadius}`
  );
  const rightEdge = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path'
  );
  rightEdge.setAttribute('d', rightEdgePath.join(' '));
  rightEdge.setAttribute('class', 'hex-edge hex-edge-p2');
  edgeGroup.appendChild(rightEdge);
  svg.appendChild(edgeGroup);

  const cellsGroup = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'g'
  );
  cellsGroup.setAttribute('class', 'hex-cells');
  const cells: SVGGElement[] = [];
  const fragment = document.createDocumentFragment();

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const center = getHexCenter(row, col);
      const cellGroup = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'g'
      );
      cellGroup.setAttribute('class', 'hex-cell-group');
      cellGroup.setAttribute(
        'transform',
        `translate(${center.x}, ${center.y})`
      );
      cellGroup.setAttribute('data-row', String(row));
      cellGroup.setAttribute('data-col', String(col));

      const hex = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'polygon'
      );
      hex.setAttribute('points', hexPath);
      hex.setAttribute('class', 'hex-cell hex-cell-empty');
      cellGroup.appendChild(hex);
      cells.push(cellGroup);
      fragment.appendChild(cellGroup);
    }
  }
  cellsGroup.appendChild(fragment);
  svg.appendChild(cellsGroup);

  // Delegated activate (listeners once).
  const activateFromEvent = (target: EventTarget | null) => {
    const el = (target as Element | null)?.closest?.(
      '.hex-cell-group'
    ) as SVGGElement | null;
    if (!el || !cellsGroup.contains(el)) return;
    if (el.style.cursor !== 'pointer') return;
    const row = Number(el.getAttribute('data-row'));
    const col = Number(el.getAttribute('data-col'));
    const binding = hexClickBindings.get(container);
    if (Number.isFinite(row) && Number.isFinite(col)) {
      binding?.onCellClick?.(row, col);
    }
  };
  cellsGroup.addEventListener('click', (e) => activateFromEvent(e.target));
  cellsGroup.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    activateFromEvent(e.target);
  });

  const labelsGroup = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'g'
  );
  labelsGroup.setAttribute('class', 'hex-labels');
  for (let col = 0; col < size; col++) {
    const center = getHexCenter(0, col);
    const label = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text'
    );
    label.setAttribute('x', String(center.x));
    label.setAttribute('y', String(center.y - hexRadius - 8));
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('class', 'hex-label');
    label.textContent = String.fromCharCode(65 + col);
    labelsGroup.appendChild(label);
  }
  for (let row = 0; row < size; row++) {
    const center = getHexCenter(row, 0);
    const label = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text'
    );
    label.setAttribute('x', String(center.x - hexWidth / 2 - 12));
    label.setAttribute('y', String(center.y + 4));
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('class', 'hex-label');
    label.textContent = String(row + 1);
    labelsGroup.appendChild(label);
  }
  svg.appendChild(labelsGroup);

  container.appendChild(svg);
  bindGridNavigation(svg);

  const cache: HexBoardCache = { svg, cells, size, hexPath };
  hexBoardCaches.set(container, cache);
  return cache;
}

function syncHexCell(
  cellGroup: SVGGElement,
  state: HexGameState,
  row: number,
  col: number,
  winningSet: Set<string>,
  onCellClick?: CellClickCallback
): void {
  const hex = cellGroup.querySelector('polygon') as SVGPolygonElement | null;
  if (!hex) return;

  const rowCells = state.board[row];
  if (rowCells === undefined) return;
  const cellState = rowCells[col] ?? null;
  const isWinningCell = winningSet.has(`${row},${col}`);

  let cellClass = 'hex-cell';
  if (cellState === 'player1') {
    cellClass += ' hex-cell-p1';
  } else if (cellState === 'player2') {
    cellClass += ' hex-cell-p2';
  } else {
    cellClass += ' hex-cell-empty';
  }
  if (isWinningCell) cellClass += ' hex-cell-winning';
  if (state.moveHistory.length > 0) {
    const lastMove = state.moveHistory[state.moveHistory.length - 1];
    if (
      lastMove !== undefined &&
      lastMove.position.row === row &&
      lastMove.position.col === col
    ) {
      cellClass += ' hex-cell-last-move';
    }
  }
  hex.setAttribute('class', cellClass);

  const isValidPlacement =
    cellState === null &&
    state.winner === null &&
    Boolean(onCellClick) &&
    !isComputerPlacementTurn(state);
  const owner =
    cellState === 'player1'
      ? 'Blue'
      : cellState === 'player2'
        ? 'Red'
        : undefined;

  makeGridCell(
    cellGroup,
    buildCellAriaLabel({
      coord: formatPosition({ row, col }),
      empty: cellState === null,
      ...(owner !== undefined ? { owner } : {}),
      validPlacement: isValidPlacement,
    })
  );
  cellGroup.style.cursor = isValidPlacement ? 'pointer' : '';
}

// Render the hex board as an SVG (structure once; cell classes sync in place).
export function renderBoard(
  state: HexGameState,
  container: HTMLElement,
  onCellClick?: CellClickCallback
): void {
  const previousFocus = captureFocusedCell(container);
  const size = state.boardSize;
  const cache = ensureHexBoard(container, size);
  hexClickBindings.set(container, { onCellClick });

  const winningPath = state.winner
    ? getWinningPath(state.board, state.winner, state.boardSize)
    : [];
  const winningSet = new Set(winningPath.map((p) => `${p.row},${p.col}`));

  let i = 0;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      syncHexCell(cache.cells[i++]!, state, row, col, winningSet, onCellClick);
    }
  }

  restoreGridFocus(container, previousFocus);
}

// Render game status
export function renderStatus(
  state: HexGameState,
  container: HTMLElement,
  gameMode: 'human-vs-human' | 'human-vs-ai' = 'human-vs-human',
  isAIThinking: boolean = false
): void {
  markStatusLive(container);
  clearElement(container);

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

  const aiSeatTurn =
    gameMode === 'human-vs-ai' &&
    !state.winner &&
    (isAIThinking || isComputerPlacementTurn(state));

  if (state.winner) {
    turnEl.classList.add('status-winner');
    if (gameMode === 'human-vs-ai' && state.winner === 'player1') {
      turnEl.textContent = `${seatIcon(state.winner)} You win!`;
    } else {
      const winnerName =
        gameMode === 'human-vs-ai'
          ? 'AI'
          : state.winner === 'player1'
            ? 'Blue'
            : 'Red';
      turnEl.textContent = `${seatIcon(state.winner)} ${winnerName} Wins!`;
    }
  } else if (aiSeatTurn) {
    // Always show thinking chrome on the computer seat (incl. pre-worker paint).
    turnEl.textContent = 'Computer is thinking…';
    turnEl.classList.add('status-ai-thinking');
  } else {
    const playerName =
      gameMode === 'human-vs-ai'
        ? 'Your'
        : state.currentPlayer === 'player1'
          ? "Blue's"
          : "Red's";
    turnEl.textContent = `${playerName} turn — Tap an empty hex`;
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
  const p1Legend =
    gameMode === 'human-vs-ai'
      ? `${seatIcon('player1')} You: Top ↔ Bottom`
      : `${seatIcon('player1')} Blue: Top ↔ Bottom`;
  const p2Legend =
    gameMode === 'human-vs-ai'
      ? `${seatIcon('player2')} AI: Left ↔ Right`
      : `${seatIcon('player2')} Red: Left ↔ Right`;
  replaceWithSafeHtml(
    legendEl,
    safeHtml`
    <span class="hex-legend-item hex-legend-p1">${p1Legend}</span>
    <span class="hex-legend-item hex-legend-p2">${p2Legend}</span>
    `
  );
  statusEl.appendChild(legendEl);

  container.appendChild(statusEl);
}

// Format position as coordinate string (e.g., "A1", "K11")
export function formatPosition(pos: HexPosition): string {
  const colLetter = String.fromCharCode(65 + pos.col);
  return `${colLetter}${pos.row + 1}`;
}
