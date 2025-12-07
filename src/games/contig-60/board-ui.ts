// Contig 60 Board UI
// Rendering the game board, dice, and expression selection

import { ContigState, CONFIG, BOARD_NUMBERS, getValidPlacements } from './types';
import { calculatePoints } from './rules';

// Colors
const COLORS = {
  background: '#f0f0f0',
  cellEmpty: '#ffffff',
  cellBorder: '#999999',
  player1: '#2196f3',
  player2: '#f44336',
  player1Light: '#bbdefb',
  player2Light: '#ffcdd2',
  validMove: '#4caf50',
  validMoveLight: '#c8e6c9',
  diceBackground: '#fff8e1',
  diceBorder: '#f57c00',
};

/**
 * Render the game board
 */
export function renderBoard(
  state: ContigState,
  onCellClick: (value: number) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'contig-board';

  // Get valid placements if dice are rolled
  const validPlacements = state.currentDice
    ? new Set(getValidPlacements(state, state.currentDice).map((p) => p.result))
    : new Set<number>();

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

      // Apply owner color
      if (cell?.owner === 'player1') {
        cellEl.classList.add('contig-cell-p1');
      } else if (cell?.owner === 'player2') {
        cellEl.classList.add('contig-cell-p2');
      } else if (validPlacements.has(value)) {
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

      // Click handler
      if (validPlacements.has(value) && state.phase === 'calculating') {
        cellEl.style.cursor = 'pointer';
        cellEl.addEventListener('click', () => onCellClick(value));
      }

      rowEl.appendChild(cellEl);
    }

    container.appendChild(rowEl);
  }

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
  header.textContent = 'Choose a number to place:';
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
  return expr
    .replace(/\*/g, '×')
    .replace(/\//g, '÷');
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
      background: ${COLORS.player1};
    }

    .contig-cell-p1 .contig-cell-value {
      color: white;
    }

    .contig-cell-p2 {
      background: ${COLORS.player2};
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

    .contig-dice-area {
      display: flex;
      justify-content: center;
      padding: 1rem;
    }

    .contig-roll-btn {
      padding: 1rem 2rem;
      font-size: 1.25rem;
      font-weight: bold;
      background: linear-gradient(135deg, ${COLORS.diceBorder}, #ff9800);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(245, 124, 0, 0.3);
      transition: all 0.2s ease;
    }

    .contig-roll-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(245, 124, 0, 0.4);
    }

    .contig-roll-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

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

    .contig-pass-btn {
      padding: 0.75rem 1.5rem;
      background: #ff9800;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }

    .contig-pass-btn:hover {
      background: #f57c00;
    }

    .contig-status {
      text-align: center;
      padding: 1rem;
    }

    .contig-status.player1 {
      color: ${COLORS.player1};
    }

    .contig-status.player2 {
      color: ${COLORS.player2};
    }

    .contig-scores {
      display: flex;
      justify-content: center;
      gap: 2rem;
      padding: 0.5rem;
    }

    .contig-score {
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 500;
    }

    .contig-score-p1 {
      background: ${COLORS.player1Light};
      color: ${COLORS.player1};
    }

    .contig-score-p2 {
      background: ${COLORS.player2Light};
      color: ${COLORS.player2};
    }

    .contig-winner-banner {
      text-align: center;
      padding: 1.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      background: linear-gradient(135deg, #ffd700, #ffec8b);
      border-radius: 8px;
      margin: 1rem;
      animation: contig-glow 1s ease-in-out infinite alternate;
    }

    @keyframes contig-glow {
      from { box-shadow: 0 0 10px rgba(255,215,0,0.5); }
      to { box-shadow: 0 0 20px rgba(255,215,0,0.8); }
    }

    @media (max-width: 600px) {
      .contig-cell {
        width: 36px;
        height: 36px;
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
  `;
  document.head.appendChild(style);
}

/**
 * Get player display name
 */
export function getPlayerName(player: 'player1' | 'player2'): string {
  return player === 'player1' ? 'Blue' : 'Red';
}
