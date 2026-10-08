// Hex Board UI - Renders the hexagonal game board

import { HexGameState, HexPosition } from './types';
import { getWinningPath } from './rules';
import { getGameModeChromeRoot, seatIcon } from '../../ui/player-colors';
import {
  buildCellAriaLabel,
  makeGridCell,
  markBoardAsGrid,
  bindGridNavigation,
  bindBoardCellKeys,
  captureFocusedCell,
  restoreGridFocus,
  markStatusLive,
  type BoardFocusable,
} from '../../ui/board-a11y';

export type CellClickCallback = (row: number, col: number) => void;

const HEX_RADIUS = 26;
const HEX_WIDTH = HEX_RADIUS * Math.sqrt(3);
const HEX_HEIGHT = HEX_RADIUS * 2;
const VERT_SPACING = HEX_HEIGHT * 0.75;
const HORIZ_SPACING = HEX_WIDTH;
const PADDING = 40;

/** Pointy-top hexagon polygon points (local coords). */
const HEX_PATH = (() => {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    pts.push(`${HEX_RADIUS * Math.cos(angle)},${HEX_RADIUS * Math.sin(angle)}`);
  }
  return pts.join(' ');
})();

interface HexBoardBinding {
  onCellClick?: CellClickCallback;
}

const boardClickBindings = new WeakMap<HTMLElement, HexBoardBinding>();
const boardCellCache = new WeakMap<SVGElement, SVGGElement[]>();

/** True when vs-AI chrome is on and it is the computer's seat to place. */
function isComputerPlacementTurn(state: HexGameState): boolean {
  const root = getGameModeChromeRoot();
  if (root?.dataset.opponent !== 'ai') return false;
  const aiSeat = root.dataset.aiSeat === 'player1' ? 'player1' : 'player2';
  return state.currentPlayer === aiSeat;
}

function getHexCenter(row: number, col: number): { x: number; y: number } {
  const x =
    PADDING + HEX_WIDTH / 2 + col * HORIZ_SPACING + row * (HEX_WIDTH / 2);
  const y = PADDING + HEX_RADIUS + row * VERT_SPACING;
  return { x, y };
}

function boardDimensions(size: number): { width: number; height: number } {
  const width =
    (size - 1) * HORIZ_SPACING +
    (size - 1) * (HEX_WIDTH / 2) +
    HEX_WIDTH +
    PADDING * 2;
  const height = (size - 1) * VERT_SPACING + HEX_HEIGHT + PADDING * 2;
  return { width, height };
}

function cellClassName(
  state: HexGameState,
  row: number,
  col: number,
  winningSet: Set<string>
): string {
  const cellState = state.board[row][col];
  let cellClass = 'hex-cell';
  if (cellState === 'player1') {
    cellClass += ' hex-cell-p1';
  } else if (cellState === 'player2') {
    cellClass += ' hex-cell-p2';
  } else {
    cellClass += ' hex-cell-empty';
  }
  if (winningSet.has(`${row},${col}`)) {
    cellClass += ' hex-cell-winning';
  }
  if (state.moveHistory.length > 0) {
    const lastMove = state.moveHistory[state.moveHistory.length - 1];
    if (lastMove.position.row === row && lastMove.position.col === col) {
      cellClass += ' hex-cell-last-move';
    }
  }
  return cellClass;
}

function appendEdgePath(
  edgeGroup: SVGGElement,
  d: string,
  className: string
): void {
  const edge = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  edge.setAttribute('d', d);
  edge.setAttribute('class', className);
  edgeGroup.appendChild(edge);
}

function buildStaticEdges(size: number): SVGGElement {
  const edgeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  edgeGroup.setAttribute('class', 'hex-edges');

  const topEdgePath: string[] = [];
  for (let col = 0; col < size; col++) {
    const center = getHexCenter(0, col);
    if (col === 0) {
      topEdgePath.push(
        `M ${center.x - HEX_WIDTH / 2} ${center.y - HEX_RADIUS}`
      );
    }
    topEdgePath.push(`L ${center.x} ${center.y - HEX_RADIUS}`);
    topEdgePath.push(`L ${center.x + HEX_WIDTH / 2} ${center.y - HEX_RADIUS}`);
  }
  appendEdgePath(edgeGroup, topEdgePath.join(' '), 'hex-edge hex-edge-p1');

  const bottomEdgePath: string[] = [];
  for (let col = 0; col < size; col++) {
    const center = getHexCenter(size - 1, col);
    if (col === 0) {
      bottomEdgePath.push(
        `M ${center.x - HEX_WIDTH / 2} ${center.y + HEX_RADIUS}`
      );
    }
    bottomEdgePath.push(`L ${center.x} ${center.y + HEX_RADIUS}`);
    bottomEdgePath.push(
      `L ${center.x + HEX_WIDTH / 2} ${center.y + HEX_RADIUS}`
    );
  }
  appendEdgePath(edgeGroup, bottomEdgePath.join(' '), 'hex-edge hex-edge-p1');

  const leftEdgePath: string[] = [];
  for (let row = 0; row < size; row++) {
    const center = getHexCenter(row, 0);
    if (row === 0) {
      leftEdgePath.push(
        `M ${center.x - HEX_WIDTH / 2} ${center.y - HEX_RADIUS}`
      );
    }
    leftEdgePath.push(`L ${center.x - HEX_WIDTH / 2} ${center.y}`);
    leftEdgePath.push(
      `L ${center.x - HEX_WIDTH / 2 + HEX_WIDTH / 2 / 2} ${center.y + HEX_RADIUS * 0.75}`
    );
  }
  const blCorner = getHexCenter(size - 1, 0);
  leftEdgePath.push(
    `L ${blCorner.x - HEX_WIDTH / 2} ${blCorner.y + HEX_RADIUS}`
  );
  appendEdgePath(edgeGroup, leftEdgePath.join(' '), 'hex-edge hex-edge-p2');

  const rightEdgePath: string[] = [];
  for (let row = 0; row < size; row++) {
    const center = getHexCenter(row, size - 1);
    if (row === 0) {
      rightEdgePath.push(
        `M ${center.x + HEX_WIDTH / 2} ${center.y - HEX_RADIUS}`
      );
    }
    rightEdgePath.push(`L ${center.x + HEX_WIDTH / 2} ${center.y}`);
    rightEdgePath.push(
      `L ${center.x + HEX_WIDTH / 2 - HEX_WIDTH / 2 / 2} ${center.y + HEX_RADIUS * 0.75}`
    );
  }
  const brCorner = getHexCenter(size - 1, size - 1);
  rightEdgePath.push(
    `L ${brCorner.x + HEX_WIDTH / 2} ${brCorner.y + HEX_RADIUS}`
  );
  appendEdgePath(edgeGroup, rightEdgePath.join(' '), 'hex-edge hex-edge-p2');

  return edgeGroup;
}

function buildLabels(size: number): SVGGElement {
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
    label.setAttribute('y', String(center.y - HEX_RADIUS - 8));
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
    label.setAttribute('x', String(center.x - HEX_WIDTH / 2 - 12));
    label.setAttribute('y', String(center.y + 4));
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('class', 'hex-label');
    label.textContent = String(row + 1);
    labelsGroup.appendChild(label);
  }

  return labelsGroup;
}

function createHexBoardShell(
  size: number
): { svg: SVGSVGElement; cells: SVGGElement[] } {
  const { width, height } = boardDimensions(size);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'hex-board');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', String(Math.round(width)));
  svg.setAttribute('height', String(Math.round(height)));
  svg.setAttribute('data-board-size', String(size));
  markBoardAsGrid(svg);

  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const hexSymbol = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'symbol'
  );
  hexSymbol.setAttribute('id', 'hex-cell');
  hexSymbol.setAttribute(
    'viewBox',
    `${-HEX_RADIUS} ${-HEX_RADIUS} ${HEX_RADIUS * 2} ${HEX_RADIUS * 2}`
  );
  const hexPolygon = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'polygon'
  );
  hexPolygon.setAttribute('points', HEX_PATH);
  hexSymbol.appendChild(hexPolygon);
  defs.appendChild(hexSymbol);
  svg.appendChild(defs);

  svg.appendChild(buildStaticEdges(size));

  const cellsGroup = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'g'
  );
  cellsGroup.setAttribute('class', 'hex-cells');

  const cells: SVGGElement[] = [];
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
      hex.setAttribute('points', HEX_PATH);
      hex.setAttribute('class', 'hex-cell hex-cell-empty');
      cellGroup.appendChild(hex);
      cellsGroup.appendChild(cellGroup);
      cells.push(cellGroup);
    }
  }

  svg.appendChild(cellsGroup);
  svg.appendChild(buildLabels(size));
  return { svg, cells };
}

function bindHexBoardInteractions(
  svg: SVGSVGElement,
  container: HTMLElement
): void {
  const handleCellAction = (cellEl: BoardFocusable) => {
    const binding = boardClickBindings.get(container);
    if (!binding?.onCellClick) return;
    const row = parseInt(cellEl.getAttribute('data-row') ?? '', 10);
    const col = parseInt(cellEl.getAttribute('data-col') ?? '', 10);
    if (!Number.isFinite(row) || !Number.isFinite(col)) return;
    binding.onCellClick(row, col);
  };

  svg.addEventListener('click', (e) => {
    const target = e.target as Element | null;
    const cellEl = target?.closest?.('.hex-cell-group') as SVGGElement | null;
    if (!cellEl || !svg.contains(cellEl)) return;
    if (cellEl.style.cursor !== 'pointer') return;
    handleCellAction(cellEl);
  });

  bindBoardCellKeys(
    svg,
    (el) => el.classList.contains('hex-cell-group'),
    handleCellAction
  );
  bindGridNavigation(svg);
}

function syncHexCell(
  cellGroup: SVGGElement,
  state: HexGameState,
  row: number,
  col: number,
  winningSet: Set<string>,
  onCellClick?: CellClickCallback
): void {
  const hex = cellGroup.querySelector('polygon');
  if (!hex) return;

  const nextClass = cellClassName(state, row, col, winningSet);
  if (hex.getAttribute('class') !== nextClass) {
    hex.setAttribute('class', nextClass);
  }

  const cellState = state.board[row][col];
  const owner =
    cellState === 'player1'
      ? 'Blue'
      : cellState === 'player2'
        ? 'Red'
        : undefined;
  const isValidPlacement =
    cellState === null &&
    state.winner === null &&
    !!onCellClick &&
    !isComputerPlacementTurn(state);

  makeGridCell(
    cellGroup,
    buildCellAriaLabel({
      coord: formatPosition({ row, col }),
      empty: cellState === null,
      owner,
      validPlacement: isValidPlacement,
    })
  );

  cellGroup.style.cursor = isValidPlacement ? 'pointer' : '';
  if (cellState === null) {
    cellGroup.classList.remove('occupied');
  } else {
    cellGroup.classList.add('occupied');
  }
}

/**
 * Render the hex board as an SVG.
 * Static geometry is created once; cell fill / last-move / a11y sync in place
 * so each move does not tear down an 11×11 SVG + per-cell listeners.
 */
export function renderBoard(
  state: HexGameState,
  container: HTMLElement,
  onCellClick?: CellClickCallback
): void {
  const previousFocus = captureFocusedCell(container);
  const size = state.boardSize;

  let svg = container.querySelector('svg.hex-board') as SVGSVGElement | null;
  let cells = svg ? boardCellCache.get(svg) : undefined;
  const sizeMismatch =
    svg?.getAttribute('data-board-size') !== String(size);

  const stats = ((
    globalThis as unknown as {
      __mpRenderStats?: Record<string, number>;
    }
  ).__mpRenderStats ??= {});

  if (!svg || !cells || sizeMismatch) {
    container.innerHTML = '';
    const created = createHexBoardShell(size);
    svg = created.svg;
    cells = created.cells;
    boardCellCache.set(svg, cells);
    container.appendChild(svg);
    bindHexBoardInteractions(svg, container);
    stats.hexFull = (stats.hexFull ?? 0) + 1;
  } else {
    stats.hexSync = (stats.hexSync ?? 0) + 1;
  }

  boardClickBindings.set(container, { onCellClick });

  const winningPath = state.winner
    ? getWinningPath(state.board, state.winner, state.boardSize)
    : [];
  const winningSet = new Set(winningPath.map((p) => `${p.row},${p.col}`));

  let i = 0;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      syncHexCell(cells[i++]!, state, row, col, winningSet, onCellClick);
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
  legendEl.innerHTML = `
    <span class="hex-legend-item hex-legend-p1">${p1Legend}</span>
    <span class="hex-legend-item hex-legend-p2">${p2Legend}</span>
  `;
  statusEl.appendChild(legendEl);

  container.appendChild(statusEl);
}

// Format position as coordinate string (e.g., "A1", "K11")
export function formatPosition(pos: HexPosition): string {
  const colLetter = String.fromCharCode(65 + pos.col);
  return `${colLetter}${pos.row + 1}`;
}
