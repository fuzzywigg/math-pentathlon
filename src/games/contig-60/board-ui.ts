// Contig 60 Board UI
// Rendering the game board, dice, and expression selection

import {
  ContigState,
  CONFIG,
  BOARD_NUMBERS,
  getValidPlacements,
} from './types';
import { calculatePoints } from './rules';
import {
  buildCellAriaLabel,
  makeGridCell,
  markBoardAsGrid,
  bindGridNavigation,
  collectGridCells,
  applyRovingTabindex,
} from '../../ui/board-a11y';

// Colors
const COLORS = {
  background: '#f0f0f0',
  cellEmpty: '#ffffff',
  cellBorder: '#999999',
  validMove: '#4caf50',
  validMoveLight: '#c8e6c9',
  diceBackground: '#fff8e1',
  diceBorder: '#f57c00',
};

export interface ContigBoardRenderOptions {
  /** When false, suppress placement highlights and activate handlers (AI seat). */
  allowInput?: boolean;
}

interface ContigClickBinding {
  onCellClick: (value: number) => void;
}

const contigClickBindings = new WeakMap<HTMLElement, ContigClickBinding>();
type ContigCellMap = Map<number, HTMLElement>;

function getContigCellMap(container: HTMLElement): ContigCellMap {
  let map = (container as HTMLElement & { __contigCells?: ContigCellMap })
    .__contigCells;
  if (!map) {
    map = new Map();
    for (const cell of Array.from(
      container.querySelectorAll('.contig-cell')
    ) as HTMLElement[]) {
      map.set(Number(cell.dataset.value), cell);
    }
    (
      container as HTMLElement & { __contigCells?: ContigCellMap }
    ).__contigCells = map;
  }
  return map;
}

/**
 * Sync an existing contig board in place (no wipe / recreate).
 */
export function syncContigBoard(
  container: HTMLElement,
  state: ContigState,
  onCellClick: (value: number) => void,
  options: ContigBoardRenderOptions = {}
): void {
  const allowInput = options.allowInput !== false;
  contigClickBindings.set(container, { onCellClick });

  const validPlacements = state.currentDice
    ? new Set(getValidPlacements(state, state.currentDice).map((p) => p.result))
    : new Set<number>();

  const cells = getContigCellMap(container);
  for (const [value, cellEl] of cells) {
    const cell = state.cells.get(value);
    const isValid =
      allowInput && validPlacements.has(value) && state.phase === 'calculating';

    cellEl.className = 'contig-cell';
    delete cellEl.dataset.points;

    if (cell?.owner === 'player1') {
      cellEl.classList.add('contig-cell-p1');
    } else if (cell?.owner === 'player2') {
      cellEl.classList.add('contig-cell-p2');
    } else if (isValid) {
      cellEl.classList.add('contig-cell-valid');
      const points = calculatePoints(state, value);
      if (points > 0) cellEl.dataset.points = `+${points}`;
    }

    const ownerLabel = cell?.owner ? getPlayerName(cell.owner) : undefined;
    makeGridCell(
      cellEl,
      buildCellAriaLabel({
        coord: String(value),
        empty: !cell?.owner,
        owner: ownerLabel,
        validPlacement: isValid,
      })
    );
    cellEl.style.cursor = isValid ? 'pointer' : '';
  }

  applyRovingTabindex(collectGridCells(container));
}

/**
 * Render the game board
 */
export function renderBoard(
  state: ContigState,
  onCellClick: (value: number) => void,
  options: ContigBoardRenderOptions = {}
): HTMLElement {
  const allowInput = options.allowInput !== false;
  const container = document.createElement('div');
  container.className = 'contig-board';
  markBoardAsGrid(container);
  contigClickBindings.set(container, { onCellClick });

  // Get valid placements if dice are rolled
  const validPlacements = state.currentDice
    ? new Set(getValidPlacements(state, state.currentDice).map((p) => p.result))
    : new Set<number>();

  const fragment = document.createDocumentFragment();
  const cellMap: ContigCellMap = new Map();

  // Create grid
  for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'contig-row';

    for (let col = 0; col < CONFIG.GRID_COLS; col++) {
      const value = BOARD_NUMBERS[row][col];
      const cell = state.cells.get(value);

      const cellEl = document.createElement('div');
      cellEl.className = 'contig-cell';
      cellEl.dataset.value = value.toString();
      cellEl.dataset.row = String(row);
      cellEl.dataset.col = String(col);

      const isValid =
        allowInput &&
        validPlacements.has(value) &&
        state.phase === 'calculating';

      // Apply owner color
      if (cell?.owner === 'player1') {
        cellEl.classList.add('contig-cell-p1');
      } else if (cell?.owner === 'player2') {
        cellEl.classList.add('contig-cell-p2');
      } else if (isValid) {
        cellEl.classList.add('contig-cell-valid');

        // Show potential points on hover
        const points = calculatePoints(state, value);
        if (points > 0) {
          cellEl.dataset.points = `+${points}`;
        }
      }

      // Display value
      const valueSpan = document.createElement('span');
      valueSpan.className = 'contig-cell-value';
      valueSpan.textContent = value.toString();
      cellEl.appendChild(valueSpan);

      const ownerLabel = cell?.owner ? getPlayerName(cell.owner) : undefined;
      makeGridCell(
        cellEl,
        buildCellAriaLabel({
          coord: String(value),
          empty: !cell?.owner,
          owner: ownerLabel,
          validPlacement: isValid,
        })
      );

      if (isValid) {
        cellEl.style.cursor = 'pointer';
      }

      cellMap.set(value, cellEl);
      rowEl.appendChild(cellEl);
    }

    fragment.appendChild(rowEl);
  }

  container.appendChild(fragment);
  (container as HTMLElement & { __contigCells?: ContigCellMap }).__contigCells =
    cellMap;

  // Delegated activate — syncContigBoard never rebinds per-cell listeners.
  container.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement).closest(
      '.contig-cell'
    ) as HTMLElement | null;
    if (!target || !container.contains(target)) return;
    if (target.style.cursor !== 'pointer') return;
    const value = Number(target.dataset.value);
    if (!Number.isFinite(value)) return;
    contigClickBindings.get(container)?.onCellClick(value);
  });
  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const target = e.target as HTMLElement;
    if (!target.classList.contains('contig-cell')) return;
    if (target.style.cursor !== 'pointer') return;
    e.preventDefault();
    const value = Number(target.dataset.value);
    if (!Number.isFinite(value)) return;
    contigClickBindings.get(container)?.onCellClick(value);
  });

  bindGridNavigation(container);
  applyRovingTabindex(collectGridCells(container));

  return container;
}

/**
 * Render the dice display
 */
export function renderDice(
  dice: [number, number, number] | null,
  onRoll: () => void,
  canRoll: boolean
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'contig-dice-area';

  if (!dice) {
    // Show roll button
    const rollBtn = document.createElement('button');
    rollBtn.className = 'contig-roll-btn';
    rollBtn.textContent = 'Roll Dice';
    rollBtn.disabled = !canRoll;
    rollBtn.addEventListener('click', onRoll);
    container.appendChild(rollBtn);
  } else {
    // Show dice values
    const diceDisplay = document.createElement('div');
    diceDisplay.className = 'contig-dice-display';

    for (const value of dice) {
      const die = document.createElement('div');
      die.className = 'contig-die';
      die.textContent = getDieFace(value);
      diceDisplay.appendChild(die);
    }

    container.appendChild(diceDisplay);
  }

  return container;
}

/**
 * Render expression selection
 */
export function renderExpressionSelector(
  state: ContigState,
  onSelect: (value: number, expression: string) => void,
  onPass: () => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'contig-expressions';

  if (!state.currentDice) return container;

  const placements = getValidPlacements(state, state.currentDice);

  if (placements.length === 0) {
    const noMoves = document.createElement('div');
    noMoves.className = 'contig-no-moves';
    noMoves.innerHTML = `
      <p>No valid moves with these dice!</p>
      <button class="contig-pass-btn">Pass Turn</button>
    `;
    noMoves.querySelector('button')?.addEventListener('click', onPass);
    container.appendChild(noMoves);
    return container;
  }

  const header = document.createElement('div');
  header.className = 'contig-expr-header';
  header.textContent = 'Or pick an expression (same as tapping a green cell):';
  container.appendChild(header);

  const list = document.createElement('div');
  list.className = 'contig-expr-list';

  for (const { result, expression } of placements) {
    const points = calculatePoints(state, result);

    const option = document.createElement('button');
    option.className = 'contig-expr-option';
    option.innerHTML = `
      <span class="expr-result">${result}</span>
      <span class="expr-formula">${formatExpression(expression)}</span>
      ${points > 0 ? `<span class="expr-points">+${points} pt${points > 1 ? 's' : ''}</span>` : ''}
    `;
    option.addEventListener('click', () => onSelect(result, expression));
    list.appendChild(option);
  }

  container.appendChild(list);

  return container;
}

/**
 * Format expression for display (replace operators with symbols)
 */
function formatExpression(expr: string): string {
  return expr.replace(/\*/g, '×').replace(/\//g, '÷');
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
export function injectContigStyles(): void {
  const existingStyle = document.getElementById('contig-styles');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'contig-styles';
  style.textContent = `
    .contig-board {
      display: flex;
      flex-direction: column;
      gap: 2px;
      background: ${COLORS.cellBorder};
      padding: 4px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .contig-row {
      display: flex;
      gap: 2px;
    }

    .contig-cell {
      width: 48px;
      height: 48px;
      background: ${COLORS.cellEmpty};
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      position: relative;
      transition: all 0.15s ease;
    }

    .contig-cell-value {
      font-weight: 600;
      font-size: 14px;
      color: #333;
    }

    .contig-cell-p1 {
      background: var(--color-player1, #2196f3);
    }

    .contig-cell-p1 .contig-cell-value {
      color: white;
    }

    .contig-cell-p2 {
      background: var(--color-player2, #f44336);
    }

    .contig-cell-p2 .contig-cell-value {
      color: white;
    }

    .contig-cell-valid {
      background: ${COLORS.validMoveLight};
      cursor: pointer;
    }

    .contig-cell-valid:hover {
      background: ${COLORS.validMove};
    }

    .contig-cell-valid:hover .contig-cell-value {
      color: white;
    }

    .contig-cell-valid[data-points]::after {
      content: attr(data-points);
      position: absolute;
      top: 2px;
      right: 2px;
      font-size: 10px;
      font-weight: bold;
      color: ${COLORS.validMove};
    }

    .contig-cell-valid:hover[data-points]::after {
      color: white;
    }

    /* Chrome (dice-area / roll / pass / status / scores / winner) → style.css */

    .contig-dice-display {
      display: flex;
      gap: 1rem;
    }

    .contig-die {
      width: 60px;
      height: 60px;
      background: ${COLORS.diceBackground};
      border: 3px solid ${COLORS.diceBorder};
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .contig-expressions {
      max-width: 500px;
      margin: 0 auto;
      padding: 1rem;
    }

    .contig-expr-header {
      text-align: center;
      font-weight: 500;
      margin-bottom: 0.75rem;
      color: #555;
    }

    .contig-expr-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 0.5rem;
    }

    .contig-expr-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.75rem;
      min-height: 44px;
      background: white;
      border: 2px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .contig-expr-option:hover {
      border-color: ${COLORS.validMove};
      background: ${COLORS.validMoveLight};
    }

    .expr-result {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }

    .expr-formula {
      font-size: 0.85rem;
      color: #666;
      font-family: monospace;
    }

    .expr-points {
      font-size: 0.9rem;
      font-weight: bold;
      color: ${COLORS.validMove};
      margin-top: 0.25rem;
    }

    .contig-no-moves {
      text-align: center;
      padding: 1rem;
      background: #fff3e0;
      border-radius: 8px;
    }

    .contig-no-moves p {
      margin: 0 0 1rem 0;
      color: #e65100;
    }

    @media (max-width: 600px) {
      .contig-board {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        max-width: 100%;
      }

      /* Keep ≥44px even on narrow fine-pointer windows (not only coarse). */
      .contig-cell {
        width: 44px;
        height: 44px;
        min-width: 44px;
        min-height: 44px;
      }

      .contig-cell-value {
        font-size: 12px;
      }

      .contig-die {
        width: 50px;
        height: 50px;
        font-size: 32px;
      }

      .contig-expr-list {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      }
    }

    /* Coarse pointers (tablets / touch laptops): keep 44px tap targets */
    @media (pointer: coarse) {
      .contig-cell {
        width: 44px;
        height: 44px;
        min-width: 44px;
        min-height: 44px;
      }

      .contig-board {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        max-width: 100%;
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
