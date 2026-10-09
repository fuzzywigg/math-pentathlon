// Juggle Board UI
// Rendering the game boards, shapes, and controls

import type { JuggleState } from './types';
import {
  CONFIG,
  getCategoryFromDie,
  getShapesForDie,
  getCategoryName,
} from './types';
import {
  getPreviewCells,
  isPlacementValid,
  getBoardFillPercentage,
} from './rules';
import type { Board } from '../../core/polyomino/placement';
import type {
  PolyominoShape,
  Rotation,
  Cell,
} from '../../core/polyomino/types';
import { getTransformedCells } from '../../core/polyomino/transform';
import {
  buildCellAriaLabel,
  makeGridCell,
  markBoardAsGrid,
  bindGridNavigation,
  bindCellActivateKeys,
  collectGridCells,
  applyRovingTabindex,
} from '../../ui/board-a11y';

// Colors
const COLORS = {
  background: '#f5f5f5',
  cellEmpty: '#ffffff',
  cellBorder: '#ccc',
  validPlacement: '#4caf50',
  invalidPlacement: '#ef5350',
  previewValid: 'rgba(76, 175, 80, 0.5)',
  previewInvalid: 'rgba(239, 83, 80, 0.5)',
};

export interface JuggleBoardRenderOptions {
  /** When false, suppress selectable chrome and activate handlers (AI seat). */
  allowInput?: boolean;
}

/** Cell lookup cached on the grid element (avoid querySelectorAll each sync). */
type JuggleCellMap = Map<string, HTMLElement>;

function getCellMap(grid: HTMLElement): JuggleCellMap {
  let map = (grid as HTMLElement & { __juggleCells?: JuggleCellMap })
    .__juggleCells;
  if (!map) {
    map = new Map();
    for (const cell of Array.from(
      grid.querySelectorAll('.juggle-cell')
    ) as HTMLElement[]) {
      map.set(`${cell.dataset.row},${cell.dataset.col}`, cell);
    }
    (grid as HTMLElement & { __juggleCells?: JuggleCellMap }).__juggleCells =
      map;
  }
  return map;
}

function previewStateForBoard(
  isCurrentPlayer: boolean,
  state: JuggleState,
  allowInput: boolean
): {
  previewSet: Set<string>;
  isPreviewValid: boolean;
} {
  const showPreview = allowInput && isCurrentPlayer;
  const previewCells: Cell[] =
    state.hoverPosition && showPreview
      ? getPreviewCells(state, state.hoverPosition)
      : [];
  const isPreviewValid =
    state.hoverPosition && showPreview
      ? isPlacementValid(state, state.hoverPosition)
      : false;
  return {
    previewSet: new Set(previewCells.map((c) => `${c.row},${c.col}`)),
    isPreviewValid: Boolean(isPreviewValid),
  };
}

/**
 * Sync cell classes / aria in place (no DOM recreate). Used for moves + hover.
 */
export function syncJuggleBoardCells(
  container: HTMLElement,
  board: Board,
  player: 'player1' | 'player2',
  isCurrentPlayer: boolean,
  state: JuggleState,
  options: JuggleBoardRenderOptions = {}
): void {
  const allowInput = options.allowInput !== false;
  container.className = `juggle-board ${player} ${isCurrentPlayer ? 'active' : ''}`;
  const fillEl = container.querySelector('.fill-percent');
  if (fillEl) {
    fillEl.textContent = `${getBoardFillPercentage(board)}%`;
  }

  const grid = container.querySelector('.juggle-grid') as HTMLElement | null;
  if (!grid) {
    return;
  }

  const { previewSet, isPreviewValid } = previewStateForBoard(
    isCurrentPlayer,
    state,
    allowInput
  );
  const cells = getCellMap(grid);

  for (let row = 0; row < CONFIG.GRID_SIZE; row++) {
    for (let col = 0; col < CONFIG.GRID_SIZE; col++) {
      const cell = cells.get(`${row},${col}`);
      if (!cell) {
        continue;
      }

      // Dense GRID_SIZE×GRID_SIZE board; loops bound by CONFIG.GRID_SIZE.
      const isOccupied = board.cells[row]?.[col] ?? false;
      const isPreview = previewSet.has(`${row},${col}`);

      cell.className = 'juggle-cell';
      if (isOccupied) {
        cell.classList.add(`occupied-${player}`);
      } else if (isPreview) {
        cell.classList.add(
          isPreviewValid ? 'preview-valid' : 'preview-invalid'
        );
      }

      const coord = `${String.fromCharCode(65 + col)}${row + 1}`;
      const canPlace =
        allowInput &&
        isCurrentPlayer &&
        state.phase === 'placing' &&
        !isOccupied;

      makeGridCell(
        cell,
        buildCellAriaLabel({
          coord,
          empty: !isOccupied,
          owner: isOccupied ? getPlayerName(player) : undefined,
          validPlacement: canPlace && isPreview && isPreviewValid,
        })
      );
      cell.style.cursor = canPlace ? 'pointer' : '';
    }
  }
}

/**
 * Hover-only paint: toggle preview classes on dirty cells only (no full board
 * wipe). Clears prior hover keys stored on the board element.
 */
export function applyJuggleHoverPreview(
  boardsRoot: HTMLElement,
  state: JuggleState,
  options: JuggleBoardRenderOptions = {}
): void {
  const allowInput = options.allowInput !== false;
  if (!allowInput || state.phase !== 'placing') {
    return;
  }

  const player = state.currentPlayer;
  const boardEl = boardsRoot.querySelector(
    `.juggle-board.${player}`
  ) as HTMLElement | null;
  if (!boardEl) {
    return;
  }
  const grid = boardEl.querySelector('.juggle-grid') as HTMLElement | null;
  if (!grid) {
    return;
  }

  const cells = getCellMap(grid);
  const prevKeys = (boardEl.dataset.hoverKeys || '').split('|').filter(Boolean);

  const clearPreview = (key: string): void => {
    const cell = cells.get(key);
    if (!cell || cell.classList.contains(`occupied-${player}`)) {
      return;
    }
    cell.classList.remove('preview-valid', 'preview-invalid');
  };

  for (const key of prevKeys) {
    clearPreview(key);
  }

  if (!state.hoverPosition) {
    boardEl.dataset.hoverKeys = '';
    return;
  }

  const previewCells = getPreviewCells(state, state.hoverPosition);
  const isValid = isPlacementValid(state, state.hoverPosition);
  const nextKeys: string[] = [];
  for (const c of previewCells) {
    const key = `${c.row},${c.col}`;
    const cell = cells.get(key);
    if (!cell || cell.classList.contains(`occupied-${player}`)) {
      continue;
    }
    cell.classList.remove('preview-valid', 'preview-invalid');
    cell.classList.add(isValid ? 'preview-valid' : 'preview-invalid');
    nextKeys.push(key);
  }
  boardEl.dataset.hoverKeys = nextKeys.join('|');
}

/**
 * Render a game board grid
 */
export function renderBoard(
  board: Board,
  player: 'player1' | 'player2',
  isCurrentPlayer: boolean,
  state: JuggleState,
  onCellClick: (row: number, col: number) => void,
  onCellHover: (row: number, col: number) => void,
  onCellLeave: () => void,
  options: JuggleBoardRenderOptions = {}
): HTMLElement {
  const allowInput = options.allowInput !== false;
  const container = document.createElement('div');
  container.className = `juggle-board ${player} ${isCurrentPlayer ? 'active' : ''}`;

  // Board header
  const header = document.createElement('div');
  header.className = 'juggle-board-header';
  header.innerHTML = `
    <span class="player-name">${player === 'player1' ? 'Blue' : 'Red'}</span>
    <span class="fill-percent">${getBoardFillPercentage(board)}%</span>
  `;
  container.appendChild(header);

  // Grid
  const grid = document.createElement('div');
  grid.className = 'juggle-grid';
  grid.style.gridTemplateColumns = `repeat(${CONFIG.GRID_SIZE}, 1fr)`;
  markBoardAsGrid(grid);

  const { previewSet, isPreviewValid } = previewStateForBoard(
    isCurrentPlayer,
    state,
    allowInput
  );

  const fragment = document.createDocumentFragment();
  const cellMap: JuggleCellMap = new Map();

  for (let row = 0; row < CONFIG.GRID_SIZE; row++) {
    for (let col = 0; col < CONFIG.GRID_SIZE; col++) {
      const cell = document.createElement('div');
      cell.className = 'juggle-cell';
      cell.dataset.row = String(row);
      cell.dataset.col = String(col);

      // ratchet: dense GRID_SIZE×GRID_SIZE board; loops bound by CONFIG.GRID_SIZE.
      const cellRow = board.cells[row];
      if (cellRow === undefined) {
        continue;
      }
      const isOccupied = cellRow[col];
      if (isOccupied === undefined) {
        continue;
      }
      const isPreview = previewSet.has(`${row},${col}`);

      if (isOccupied) {
        cell.classList.add(`occupied-${player}`);
      } else if (isPreview) {
        cell.classList.add(
          isPreviewValid ? 'preview-valid' : 'preview-invalid'
        );
      }

      const coord = `${String.fromCharCode(65 + col)}${row + 1}`;
      const canPlace =
        allowInput &&
        isCurrentPlayer &&
        state.phase === 'placing' &&
        !isOccupied;

      makeGridCell(
        cell,
        buildCellAriaLabel({
          coord,
          empty: !isOccupied,
          owner: isOccupied ? getPlayerName(player) : undefined,
          validPlacement: canPlace && isPreview && isPreviewValid,
        })
      );

      if (canPlace) {
        cell.style.cursor = 'pointer';
      }

      cellMap.set(`${row},${col}`, cell);
      fragment.appendChild(cell);
    }
  }

  grid.appendChild(fragment);
  (grid as HTMLElement & { __juggleCells?: JuggleCellMap }).__juggleCells =
    cellMap;

  // Delegated click / hover so syncJuggleBoardCells never rebinds listeners.
  grid.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest(
      '.juggle-cell'
    ) as HTMLElement | null;
    if (!target || !grid.contains(target)) {
      return;
    }
    if (target.style.cursor !== 'pointer') {
      return;
    }
    const row = Number(target.dataset.row);
    const col = Number(target.dataset.col);
    if (Number.isFinite(row) && Number.isFinite(col)) {
      onCellClick(row, col);
    }
  });
  grid.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') {
      return;
    }
    const target = e.target as HTMLElement;
    if (!target.classList.contains('juggle-cell')) {
      return;
    }
    if (target.style.cursor !== 'pointer') {
      return;
    }
    e.preventDefault();
    const row = Number(target.dataset.row);
    const col = Number(target.dataset.col);
    if (Number.isFinite(row) && Number.isFinite(col)) {
      onCellClick(row, col);
    }
  });
  grid.addEventListener(
    'mouseenter',
    (e) => {
      const target = e.target as HTMLElement;
      if (!target.classList?.contains?.('juggle-cell')) {
        return;
      }
      if (target.style.cursor !== 'pointer') {
        return;
      }
      const row = Number(target.dataset.row);
      const col = Number(target.dataset.col);
      if (Number.isFinite(row) && Number.isFinite(col)) {
        onCellHover(row, col);
      }
    },
    true
  );
  grid.addEventListener(
    'mouseleave',
    (e) => {
      const target = e.target as HTMLElement;
      if (!target.classList?.contains?.('juggle-cell')) {
        return;
      }
      onCellLeave();
    },
    true
  );

  bindGridNavigation(grid);
  applyRovingTabindex(collectGridCells(grid));
  container.appendChild(grid);

  return container;
}

/**
 * Render dice display
 */
export function renderDice(
  dice: [number, number] | null,
  onRoll: () => void,
  onSelectDie: (index: 0 | 1) => void,
  canRoll: boolean,
  phase: string,
  options: JuggleBoardRenderOptions = {}
): HTMLElement {
  const allowInput = options.allowInput !== false;
  const container = document.createElement('div');
  container.className = 'juggle-dice-area';

  if (!dice) {
    // Show roll button
    const rollBtn = document.createElement('button');
    rollBtn.className = 'juggle-roll-btn';
    rollBtn.textContent = 'Roll Dice';
    rollBtn.disabled = !canRoll || !allowInput;
    if (allowInput) {
      rollBtn.addEventListener('click', onRoll);
    }
    container.appendChild(rollBtn);
  } else {
    const diceDisplay = document.createElement('div');
    diceDisplay.className = 'juggle-dice-display';

    for (let i = 0; i < 2; i++) {
      const dieContainer = document.createElement('div');
      dieContainer.className = 'juggle-die-container';

      const die = document.createElement('div');
      die.className = 'juggle-die';
      // ratchet: dice is [number, number]; loop i in 0..1.
      const dieValue = dice[i];
      if (dieValue === undefined) {
        continue;
      }
      die.textContent = getDieFace(dieValue);

      const category = getCategoryFromDie(dieValue);
      const label = document.createElement('div');
      label.className = 'juggle-die-label';
      label.textContent = getCategoryName(category);

      if (phase === 'selectingShape' && allowInput) {
        die.classList.add('selectable');
        die.setAttribute('role', 'button');
        die.tabIndex = 0;
        die.setAttribute(
          'aria-label',
          `${getCategoryName(category)} die, selectable`
        );
        const activate = () => onSelectDie(i as 0 | 1);
        die.addEventListener('click', activate);
        bindCellActivateKeys(die, activate);
      } else if (phase === 'selectingShape') {
        die.setAttribute('aria-disabled', 'true');
        die.setAttribute(
          'aria-label',
          `${getCategoryName(category)} die, not selectable`
        );
      }

      dieContainer.appendChild(die);
      dieContainer.appendChild(label);
      diceDisplay.appendChild(dieContainer);
    }

    container.appendChild(diceDisplay);

    if (phase === 'selectingShape') {
      const hint = document.createElement('div');
      hint.className = 'juggle-hint';
      hint.textContent = allowInput
        ? 'Click a die to choose that shape category'
        : 'Computer is thinking…';
      container.appendChild(hint);
    }
  }

  return container;
}

/**
 * Render shape selection
 */
export function renderShapeSelector(
  state: JuggleState,
  onSelectShape: (shape: PolyominoShape) => void,
  options: JuggleBoardRenderOptions = {}
): HTMLElement {
  const allowInput = options.allowInput !== false;
  const container = document.createElement('div');
  container.className = 'juggle-shape-selector';

  if (!state.currentDice || !state.selectedCategory) {
    return container;
  }

  // Get selected die value
  const dieValue = state.currentDice.find(
    (d) => getCategoryFromDie(d) === state.selectedCategory
  );
  if (!dieValue) {
    return container;
  }

  const shapes = getShapesForDie(dieValue);

  const header = document.createElement('div');
  header.className = 'juggle-shape-header';
  header.textContent = allowInput
    ? `Choose a ${state.selectedCategory}:`
    : 'Computer is choosing a shape…';
  container.appendChild(header);

  const list = document.createElement('div');
  list.className = 'juggle-shape-list';

  for (const shape of shapes) {
    const option = document.createElement('div');
    option.className = 'juggle-shape-option';
    option.appendChild(renderShapePreview(shape, 0, false));

    const name = document.createElement('span');
    name.className = 'shape-name';
    name.textContent = shape.name;
    option.appendChild(name);

    if (allowInput) {
      option.setAttribute('role', 'button');
      option.tabIndex = 0;
      option.setAttribute('aria-label', `${shape.name}, selectable`);
      const activate = () => onSelectShape(shape);
      option.addEventListener('click', activate);
      bindCellActivateKeys(option, activate);
    } else {
      option.classList.add('disabled');
      option.setAttribute('aria-disabled', 'true');
      option.setAttribute('aria-label', `${shape.name}, not selectable`);
    }
    list.appendChild(option);
  }

  container.appendChild(list);

  return container;
}

/**
 * Render shape preview
 */
function renderShapePreview(
  shape: PolyominoShape,
  rotation: Rotation,
  flipped: boolean,
  cellSize: number = 12
): HTMLElement {
  const cells = getTransformedCells(shape, rotation, flipped);
  const minRow = Math.min(...cells.map((c) => c.row));
  const maxRow = Math.max(...cells.map((c) => c.row));
  const minCol = Math.min(...cells.map((c) => c.col));
  const maxCol = Math.max(...cells.map((c) => c.col));

  const width = (maxCol - minCol + 1) * cellSize + 4;
  const height = (maxRow - minRow + 1) * cellSize + 4;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  if (ctx === null) {
    return canvas;
  }

  for (const cell of cells) {
    const x = (cell.col - minCol) * cellSize + 2;
    const y = (cell.row - minRow) * cellSize + 2;

    ctx.fillStyle = shape.color;
    ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
    ctx.strokeStyle = '#333';
    ctx.strokeRect(x, y, cellSize - 1, cellSize - 1);
  }

  return canvas;
}

/**
 * Render rotation/flip controls
 */
export function renderShapeControls(
  state: JuggleState,
  onRotate: () => void,
  onFlip: () => void,
  options: JuggleBoardRenderOptions = {}
): HTMLElement {
  const allowInput = options.allowInput !== false;
  const container = document.createElement('div');
  container.className = 'juggle-shape-controls';

  if (!state.selectedShape || state.phase !== 'placing') {
    return container;
  }

  // Show current shape preview
  const preview = document.createElement('div');
  preview.className = 'juggle-current-shape';
  preview.appendChild(
    renderShapePreview(
      state.selectedShape,
      state.selectedRotation,
      state.selectedFlipped,
      16
    )
  );
  container.appendChild(preview);

  // Control buttons
  const controls = document.createElement('div');
  controls.className = 'juggle-control-buttons';

  if (state.selectedShape.canRotate) {
    const rotateBtn = document.createElement('button');
    rotateBtn.className = 'juggle-control-btn';
    rotateBtn.textContent = '↻ Rotate';
    rotateBtn.disabled = !allowInput;
    if (allowInput) {
      rotateBtn.addEventListener('click', onRotate);
    }
    controls.appendChild(rotateBtn);
  }

  if (state.selectedShape.canFlip) {
    const flipBtn = document.createElement('button');
    flipBtn.className = 'juggle-control-btn';
    flipBtn.textContent = '↔ Flip';
    flipBtn.disabled = !allowInput;
    if (allowInput) {
      flipBtn.addEventListener('click', onFlip);
    }
    controls.appendChild(flipBtn);
  }

  container.appendChild(controls);

  const hint = document.createElement('div');
  hint.className = 'juggle-hint';
  hint.textContent = allowInput
    ? 'Click on your board to place the shape'
    : 'Computer is placing…';
  container.appendChild(hint);

  return container;
}

/**
 * Get dice face emoji
 */
function getDieFace(value: number): string {
  const faces = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
  return faces[value] || value.toString();
}

/**
 * Inject CSS styles
 */
export function injectJuggleStyles(): void {
  const existingStyle = document.getElementById('juggle-styles');
  if (existingStyle) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'juggle-styles';
  style.textContent = `
    .juggle-boards {
      display: flex;
      gap: 2rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .juggle-board {
      background: ${COLORS.background};
      padding: 1rem;
      border-radius: 12px;
      border: 3px solid transparent;
      transition: border-color 0.2s;
    }

    .juggle-board.active {
      border-color: #ffc107;
    }

    .juggle-board.player1 .juggle-board-header { color: var(--color-player1, #2196f3); }
    .juggle-board.player2 .juggle-board-header { color: var(--color-player2, #f44336); }

    .juggle-board-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }

    .fill-percent {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    .juggle-grid {
      display: grid;
      gap: 1px;
      background: ${COLORS.cellBorder};
      padding: 1px;
      border-radius: 4px;
    }

    .juggle-cell {
      width: 28px;
      height: 28px;
      min-width: 28px;
      min-height: 28px;
      background: ${COLORS.cellEmpty};
      transition: background 0.1s;
    }

    .juggle-cell.occupied-player1 { background: var(--color-player1, #2196f3); }
    .juggle-cell.occupied-player2 { background: var(--color-player2, #f44336); }

    .juggle-cell.preview-valid { background: ${COLORS.previewValid}; }
    .juggle-cell.preview-invalid { background: ${COLORS.previewInvalid}; }

    .juggle-dice-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      gap: 0.5rem;
    }

    .juggle-roll-btn {
      padding: 1rem 2rem;
      min-height: 44px;
      font-size: 1.25rem;
      font-weight: bold;
      background: linear-gradient(135deg, #ff9800, #f57c00);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(245, 124, 0, 0.3);
    }

    .juggle-roll-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .juggle-roll-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .juggle-dice-display {
      display: flex;
      gap: 2rem;
    }

    .juggle-die-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .juggle-die {
      width: 60px;
      height: 60px;
      background: #fff8e1;
      border: 3px solid #f57c00;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      transition: all 0.2s;
    }

    .juggle-die.selectable {
      cursor: pointer;
    }

    .juggle-die.selectable:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(245, 124, 0, 0.4);
    }

    .juggle-die-label {
      font-size: 0.75rem;
      color: #666;
      text-align: center;
    }

    .juggle-hint {
      font-size: 0.9rem;
      color: #666;
      text-align: center;
      margin-top: 0.5rem;
    }

    .juggle-shape-selector {
      padding: 1rem;
      max-width: 500px;
      margin: 0 auto;
    }

    .juggle-shape-header {
      text-align: center;
      font-weight: 500;
      margin-bottom: 0.75rem;
    }

    .juggle-shape-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      justify-content: center;
    }

    .juggle-shape-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem;
      min-height: 44px;
      min-width: 44px;
      background: white;
      border: 2px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .juggle-shape-option:hover:not(.disabled) {
      border-color: ${COLORS.validPlacement};
      background: #e8f5e9;
    }

    .juggle-shape-option.disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .shape-name {
      font-size: 0.75rem;
      color: #666;
    }

    .juggle-shape-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
    }

    .juggle-current-shape {
      padding: 0.5rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .juggle-control-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .juggle-control-btn {
      padding: 0.5rem 1rem;
      min-height: 44px;
      background: #e0e0e0;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.15s;
    }

    .juggle-control-btn:hover:not(:disabled) {
      background: #bdbdbd;
    }

    .juggle-control-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .juggle-status {
      text-align: center;
      padding: 1rem;
    }

    .juggle-status.player1 { color: var(--color-player1, #2196f3); }
    .juggle-status.player2 { color: var(--color-player2, #f44336); }

    .juggle-status.status-ai-thinking {
      font-style: italic;
      opacity: 0.9;
    }

    .juggle-winner-banner {
      text-align: center;
      padding: 1.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(135deg, #ffd700, #ffec8b);
      border-radius: 8px;
      margin: 1rem;
      animation: juggle-glow 1s ease-in-out infinite alternate;
    }

    @keyframes juggle-glow {
      from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }
      to { box-shadow: 0 0 20px rgba(255,215,0,0.8); }
    }

    /* Coarse pointers (tablets / touch laptops): keep 44px tap targets */
    @media (pointer: coarse) {
      .juggle-cell {
        width: 44px;
        height: 44px;
        min-width: 44px;
        min-height: 44px;
      }

      .juggle-grid {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        max-width: 100%;
      }

      .juggle-roll-btn,
      .juggle-control-btn,
      .juggle-shape-option {
        min-height: 44px;
      }

      .juggle-die {
        width: 60px;
        height: 60px;
        min-width: 44px;
        min-height: 44px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .juggle-board,
      .juggle-cell,
      .juggle-die,
      .juggle-roll-btn,
      .juggle-shape-option,
      .juggle-control-btn,
      .juggle-winner-banner {
        transition: none;
        animation: none !important;
      }

      .juggle-roll-btn:hover:not(:disabled),
      .juggle-die.selectable:hover {
        transform: none;
      }
    }

    html[data-reduced-motion='true'] .juggle-board,
    html[data-reduced-motion='true'] .juggle-cell,
    html[data-reduced-motion='true'] .juggle-die,
    html[data-reduced-motion='true'] .juggle-roll-btn,
    html[data-reduced-motion='true'] .juggle-shape-option,
    html[data-reduced-motion='true'] .juggle-control-btn,
    html[data-reduced-motion='true'] .juggle-winner-banner {
      transition: none;
      animation: none !important;
    }
    html[data-reduced-motion='true'] .juggle-roll-btn:hover:not(:disabled),
    html[data-reduced-motion='true'] .juggle-die.selectable:hover {
      transform: none;
    }

    @media (max-width: 700px) {
      .juggle-boards {
        flex-direction: column;
        align-items: center;
      }

      .juggle-cell {
        width: 24px;
        height: 24px;
        min-width: 24px;
        min-height: 24px;
      }
    }

    @media (max-width: 700px) and (pointer: coarse) {
      .juggle-cell {
        width: 36px;
        height: 36px;
        min-width: 36px;
        min-height: 36px;
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
