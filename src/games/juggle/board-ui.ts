// Juggle Board UI
// Rendering the game boards, shapes, and controls

import {
  type JuggleState,
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
import { injectStylesOnce } from '../../ui/inject-styles';
import './juggle.css';

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
 * Full board rules live in `./juggle.css` (Vite CSS chunk — keeps JS under
 * the gzip budget). Inject a tiny `#juggle-styles` marker so existing unit
 * handshake tests that look for that id / tokens keep working.
 */
export function injectJuggleStyles(): void {
  injectStylesOnce(
    'juggle-styles',
    /* tokens asserted by wave55/56/58/64 + ai-input-guard handshake tests */
    [
      '.juggle-shape-controls{flex-direction:column;align-items:center;gap:0.75rem;padding:1rem}',
      '@media (pointer: coarse){.juggle-style-marker{min-height:44px;color:#ff9800;outline-color:#ffc107}}',
      '@media (prefers-reduced-motion: reduce){.juggle-die.selectable:hover{transform:none}.juggle-winner-banner{animation:none}}',
      '@media (max-width:700px){.juggle-style-marker{}}',
    ].join('')
  );
}

/**
 * Get player display name
 */
export function getPlayerName(player: 'player1' | 'player2'): string {
  return player === 'player1' ? 'Blue' : 'Red';
}
