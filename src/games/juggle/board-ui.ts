// Juggle Board UI
// Rendering the game boards, shapes, and controls

import { JuggleState, CONFIG, getCategoryFromDie, getShapesForDie, getCategoryName } from './types';
import { getPreviewCells, isPlacementValid, getBoardFillPercentage } from './rules';
import { Board } from '../../core/polyomino/placement';
import { PolyominoShape, Rotation, Cell } from '../../core/polyomino/types';
import { getTransformedCells } from '../../core/polyomino/transform';

// Colors
const COLORS = {
  background: '#f5f5f5',
  cellEmpty: '#ffffff',
  cellBorder: '#ccc',
  player1: '#2196f3',
  player2: '#f44336',
  player1Light: '#bbdefb',
  player2Light: '#ffcdd2',
  validPlacement: '#4caf50',
  invalidPlacement: '#ef5350',
  previewValid: 'rgba(76, 175, 80, 0.5)',
  previewInvalid: 'rgba(239, 83, 80, 0.5)',
};

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
  onCellLeave: () => void
): HTMLElement {
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

  // Get preview cells if hovering
  const previewCells: Cell[] = state.hoverPosition && isCurrentPlayer
    ? getPreviewCells(state, state.hoverPosition)
    : [];
  const isPreviewValid = state.hoverPosition && isCurrentPlayer
    ? isPlacementValid(state, state.hoverPosition)
    : false;
  const previewSet = new Set(previewCells.map(c => `${c.row},${c.col}`));

  for (let row = 0; row < CONFIG.GRID_SIZE; row++) {
    for (let col = 0; col < CONFIG.GRID_SIZE; col++) {
      const cell = document.createElement('div');
      cell.className = 'juggle-cell';

      const isOccupied = board.cells[row][col];
      const isPreview = previewSet.has(`${row},${col}`);

      if (isOccupied) {
        cell.classList.add(`occupied-${player}`);
      } else if (isPreview) {
        cell.classList.add(isPreviewValid ? 'preview-valid' : 'preview-invalid');
      }

      if (isCurrentPlayer && state.phase === 'placing' && !isOccupied) {
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', () => onCellClick(row, col));
        cell.addEventListener('mouseenter', () => onCellHover(row, col));
        cell.addEventListener('mouseleave', onCellLeave);
      }

      grid.appendChild(cell);
    }
  }

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
  phase: string
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'juggle-dice-area';

  if (!dice) {
    // Show roll button
    const rollBtn = document.createElement('button');
    rollBtn.className = 'juggle-roll-btn';
    rollBtn.textContent = 'Roll Dice';
    rollBtn.disabled = !canRoll;
    rollBtn.addEventListener('click', onRoll);
    container.appendChild(rollBtn);
  } else {
    const diceDisplay = document.createElement('div');
    diceDisplay.className = 'juggle-dice-display';

    for (let i = 0; i < 2; i++) {
      const dieContainer = document.createElement('div');
      dieContainer.className = 'juggle-die-container';

      const die = document.createElement('div');
      die.className = 'juggle-die';
      die.textContent = getDieFace(dice[i]);

      const category = getCategoryFromDie(dice[i]);
      const label = document.createElement('div');
      label.className = 'juggle-die-label';
      label.textContent = getCategoryName(category);

      if (phase === 'selectingShape') {
        die.classList.add('selectable');
        die.addEventListener('click', () => onSelectDie(i as 0 | 1));
      }

      dieContainer.appendChild(die);
      dieContainer.appendChild(label);
      diceDisplay.appendChild(dieContainer);
    }

    container.appendChild(diceDisplay);

    if (phase === 'selectingShape') {
      const hint = document.createElement('div');
      hint.className = 'juggle-hint';
      hint.textContent = 'Click a die to choose that shape category';
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
  onSelectShape: (shape: PolyominoShape) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'juggle-shape-selector';

  if (!state.currentDice || !state.selectedCategory) return container;

  // Get selected die value
  const dieValue = state.currentDice.find(d => getCategoryFromDie(d) === state.selectedCategory);
  if (!dieValue) return container;

  const shapes = getShapesForDie(dieValue);

  const header = document.createElement('div');
  header.className = 'juggle-shape-header';
  header.textContent = `Choose a ${state.selectedCategory}:`;
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

    option.addEventListener('click', () => onSelectShape(shape));
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
  const minRow = Math.min(...cells.map(c => c.row));
  const maxRow = Math.max(...cells.map(c => c.row));
  const minCol = Math.min(...cells.map(c => c.col));
  const maxCol = Math.max(...cells.map(c => c.col));

  const width = (maxCol - minCol + 1) * cellSize + 4;
  const height = (maxRow - minRow + 1) * cellSize + 4;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d')!;

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
  onFlip: () => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'juggle-shape-controls';

  if (!state.selectedShape || state.phase !== 'placing') return container;

  // Show current shape preview
  const preview = document.createElement('div');
  preview.className = 'juggle-current-shape';
  preview.appendChild(renderShapePreview(
    state.selectedShape,
    state.selectedRotation,
    state.selectedFlipped,
    16
  ));
  container.appendChild(preview);

  // Control buttons
  const controls = document.createElement('div');
  controls.className = 'juggle-control-buttons';

  if (state.selectedShape.canRotate) {
    const rotateBtn = document.createElement('button');
    rotateBtn.className = 'juggle-control-btn';
    rotateBtn.textContent = '↻ Rotate';
    rotateBtn.addEventListener('click', onRotate);
    controls.appendChild(rotateBtn);
  }

  if (state.selectedShape.canFlip) {
    const flipBtn = document.createElement('button');
    flipBtn.className = 'juggle-control-btn';
    flipBtn.textContent = '↔ Flip';
    flipBtn.addEventListener('click', onFlip);
    controls.appendChild(flipBtn);
  }

  container.appendChild(controls);

  const hint = document.createElement('div');
  hint.className = 'juggle-hint';
  hint.textContent = 'Click on your board to place the shape';
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
  if (existingStyle) return;

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

    .juggle-board.player1 .juggle-board-header { color: ${COLORS.player1}; }
    .juggle-board.player2 .juggle-board-header { color: ${COLORS.player2}; }

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
      background: ${COLORS.cellEmpty};
      transition: background 0.1s;
    }

    .juggle-cell.occupied-player1 { background: ${COLORS.player1}; }
    .juggle-cell.occupied-player2 { background: ${COLORS.player2}; }

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
      background: white;
      border: 2px solid #ddd;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .juggle-shape-option:hover {
      border-color: ${COLORS.validPlacement};
      background: #e8f5e9;
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
      background: #e0e0e0;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.15s;
    }

    .juggle-control-btn:hover {
      background: #bdbdbd;
    }

    .juggle-status {
      text-align: center;
      padding: 1rem;
    }

    .juggle-status.player1 { color: ${COLORS.player1}; }
    .juggle-status.player2 { color: ${COLORS.player2}; }

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

    @media (max-width: 700px) {
      .juggle-boards {
        flex-direction: column;
        align-items: center;
      }

      .juggle-cell {
        width: 24px;
        height: 24px;
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
