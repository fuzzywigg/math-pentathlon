// Prime Gold Board UI
// Renders the spiral board and dice

import {
  PrimeGoldState,
  Player,
  CONFIG,
  isPrime,
} from './types';
import { getValidPlacements } from './rules';

// =============================================================================
// Style Injection
// =============================================================================

let stylesInjected = false;

export function injectPrimeGoldStyles(): void {
  if (stylesInjected) return;
  stylesInjected = true;

  const style = document.createElement('style');
  style.textContent = `
    .pg-game-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
    }

    .pg-status {
      font-size: 1.2rem;
      font-weight: bold;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      text-align: center;
    }

    .pg-status.player1 {
      background: rgba(25, 118, 210, 0.2);
      color: #1976d2;
    }

    .pg-status.player2 {
      background: rgba(229, 57, 53, 0.2);
      color: #e53935;
    }

    .pg-scores {
      display: flex;
      gap: 2rem;
      font-size: 1rem;
    }

    .pg-score {
      padding: 0.5rem 1rem;
      border-radius: 8px;
    }

    .pg-score.player1 {
      background: rgba(25, 118, 210, 0.15);
      color: #1976d2;
    }

    .pg-score.player2 {
      background: rgba(229, 57, 53, 0.15);
      color: #e53935;
    }

    .pg-main-layout {
      display: flex;
      gap: 1.5rem;
      align-items: flex-start;
      flex-wrap: wrap;
      justify-content: center;
    }

    .pg-board-container {
      background: #2d2d2d;
      padding: 1rem;
      border-radius: 12px;
    }

    .pg-board {
      display: grid;
      grid-template-columns: repeat(${CONFIG.BOARD_SIZE}, 50px);
      gap: 3px;
    }

    .pg-cell {
      width: 50px;
      height: 50px;
      background: #3d3d3d;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: bold;
      cursor: default;
      position: relative;
      transition: all 0.2s;
    }

    .pg-cell.prime {
      background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%);
      color: #333;
    }

    .pg-cell.valid {
      box-shadow: inset 0 0 0 3px #4caf50;
      cursor: pointer;
    }

    .pg-cell.valid:hover {
      background: rgba(76, 175, 80, 0.3);
      transform: scale(1.05);
    }

    .pg-cell.player1 {
      background: #1976d2 !important;
      color: white !important;
    }

    .pg-cell.player2 {
      background: #e53935 !important;
      color: white !important;
    }

    .pg-cell.player1.prime,
    .pg-cell.player2.prime {
      box-shadow: 0 0 0 3px gold;
    }

    .pg-dice-area {
      background: #2d2d2d;
      padding: 1rem;
      border-radius: 12px;
      text-align: center;
    }

    .pg-dice-container {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin: 0.5rem 0;
    }

    .pg-die {
      width: 50px;
      height: 50px;
      background: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
      box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
    }

    .pg-die.rolling {
      animation: shake 0.3s infinite;
    }

    @keyframes shake {
      0%, 100% { transform: rotate(-5deg); }
      50% { transform: rotate(5deg); }
    }

    .pg-roll-btn {
      padding: 0.75rem 2rem;
      background: #4caf50;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pg-roll-btn:hover {
      background: #388e3c;
    }

    .pg-roll-btn:disabled {
      background: #666;
      cursor: not-allowed;
    }

    .pg-expressions {
      background: #2d2d2d;
      padding: 1rem;
      border-radius: 12px;
      max-height: 300px;
      overflow-y: auto;
      min-width: 180px;
    }

    .pg-expressions h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      color: #aaa;
    }

    .pg-expr-item {
      padding: 6px 10px;
      margin: 4px 0;
      background: #3d3d3d;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }

    .pg-expr-item:hover {
      background: #4caf50;
    }

    .pg-expr-item.prime {
      border-left: 3px solid gold;
    }

    .pg-winner-banner {
      font-size: 1.5rem;
      font-weight: bold;
      padding: 1rem 2rem;
      background: linear-gradient(135deg, #ffd700, #ffb300);
      color: #333;
      border-radius: 12px;
      animation: pulse 1s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }

    .pg-controls {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      justify-content: center;
    }

    .pg-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .pg-btn-primary {
      background: #4caf50;
      color: white;
    }

    .pg-btn-primary:hover {
      background: #388e3c;
    }

    .pg-btn-secondary {
      background: #666;
      color: white;
    }

    .pg-btn-secondary:hover {
      background: #555;
    }

    .pg-legend {
      display: flex;
      gap: 1rem;
      font-size: 0.85rem;
      color: #aaa;
    }

    .pg-legend-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .pg-legend-swatch {
      width: 16px;
      height: 16px;
      border-radius: 3px;
    }

    .pg-legend-swatch.prime {
      background: linear-gradient(135deg, #ffd700 0%, #b8860b 100%);
    }

    .pg-legend-swatch.p1 {
      background: #1976d2;
    }

    .pg-legend-swatch.p2 {
      background: #e53935;
    }

    .pg-move-history {
      background: #2d2d2d;
      padding: 1rem;
      border-radius: 12px;
      max-height: 200px;
      overflow-y: auto;
      min-width: 200px;
    }

    .pg-move-history h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      color: #aaa;
    }

    .pg-move-item {
      font-size: 0.8rem;
      padding: 4px 0;
      border-bottom: 1px solid #3d3d3d;
    }

    .pg-move-item:last-child {
      border-bottom: none;
    }

    .pg-move-item.player1 { color: #64b5f6; }
    .pg-move-item.player2 { color: #ef9a9a; }
  `;
  document.head.appendChild(style);
}

// =============================================================================
// Player Names
// =============================================================================

export function getPlayerName(player: Player): string {
  return player === 'player1' ? 'Blue' : 'Red';
}

// =============================================================================
// Board Rendering
// =============================================================================

/**
 * Render the game board
 */
export function renderBoard(
  state: PrimeGoldState,
  onCellClick: (value: number, expr: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'pg-board-container';

  const board = document.createElement('div');
  board.className = 'pg-board';

  const validPlacements = getValidPlacements(state);
  const validMap = new Map(validPlacements.map((p) => [p.value, p.expr]));

  // Create cells in grid order
  for (let row = 0; row < CONFIG.BOARD_SIZE; row++) {
    for (let col = 0; col < CONFIG.BOARD_SIZE; col++) {
      const cell = state.cells.get(`${row},${col}`);

      const cellEl = document.createElement('div');
      cellEl.className = 'pg-cell';

      if (cell) {
        cellEl.textContent = cell.value.toString();

        if (cell.isPrime && !cell.owner) cellEl.classList.add('prime');
        if (cell.owner) cellEl.classList.add(cell.owner);
        if (cell.isPrime && cell.owner) cellEl.classList.add('prime');

        const expr = validMap.get(cell.value);
        if (expr) {
          cellEl.classList.add('valid');
          cellEl.addEventListener('click', () => onCellClick(cell.value, expr));
        }
      }

      board.appendChild(cellEl);
    }
  }

  container.appendChild(board);

  // Legend
  const legend = document.createElement('div');
  legend.className = 'pg-legend';
  legend.innerHTML = `
    <div class="pg-legend-item">
      <div class="pg-legend-swatch prime"></div>
      <span>Prime</span>
    </div>
    <div class="pg-legend-item">
      <div class="pg-legend-swatch p1"></div>
      <span>Blue</span>
    </div>
    <div class="pg-legend-item">
      <div class="pg-legend-swatch p2"></div>
      <span>Red</span>
    </div>
  `;
  container.appendChild(legend);

  return container;
}

// =============================================================================
// Dice Rendering
// =============================================================================

/**
 * Render dice area
 */
export function renderDice(
  state: PrimeGoldState,
  onRoll: () => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'pg-dice-area';

  const title = document.createElement('div');
  title.innerHTML = `<strong>${getPlayerName(state.currentPlayer)}'s Turn</strong>`;
  container.appendChild(title);

  const diceContainer = document.createElement('div');
  diceContainer.className = 'pg-dice-container';

  if (state.diceRoll) {
    const die1 = document.createElement('div');
    die1.className = 'pg-die';
    die1.textContent = state.diceRoll.die1.toString();

    const die2 = document.createElement('div');
    die2.className = 'pg-die';
    die2.textContent = state.diceRoll.die2.toString();

    const die3 = document.createElement('div');
    die3.className = 'pg-die';
    die3.textContent = state.diceRoll.die3.toString();

    diceContainer.appendChild(die1);
    diceContainer.appendChild(die2);
    diceContainer.appendChild(die3);
  } else {
    for (let i = 0; i < 3; i++) {
      const die = document.createElement('div');
      die.className = 'pg-die';
      die.textContent = '?';
      diceContainer.appendChild(die);
    }
  }

  container.appendChild(diceContainer);

  if (state.phase === 'rolling') {
    const rollBtn = document.createElement('button');
    rollBtn.className = 'pg-roll-btn';
    rollBtn.textContent = 'Roll Dice';
    rollBtn.addEventListener('click', onRoll);
    container.appendChild(rollBtn);
  }

  return container;
}

// =============================================================================
// Expressions List
// =============================================================================

/**
 * Render valid expressions
 */
export function renderExpressions(
  state: PrimeGoldState,
  onSelect: (value: number, expr: string) => void
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'pg-expressions';

  const title = document.createElement('h3');
  title.textContent = 'Valid Moves';
  container.appendChild(title);

  const placements = getValidPlacements(state);

  if (placements.length === 0 && state.phase === 'placing') {
    const noMoves = document.createElement('div');
    noMoves.style.color = '#888';
    noMoves.textContent = 'No valid moves - pass turn';
    container.appendChild(noMoves);
  } else {
    for (const { value, expr } of placements) {
      const item = document.createElement('div');
      item.className = 'pg-expr-item';
      if (isPrime(value)) item.classList.add('prime');
      item.innerHTML = `<strong>${value}</strong> = ${expr}`;
      item.addEventListener('click', () => onSelect(value, expr));
      container.appendChild(item);
    }
  }

  return container;
}

// =============================================================================
// Score Display
// =============================================================================

/**
 * Render scores
 */
export function renderScores(state: PrimeGoldState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'pg-scores';

  const p1Score = document.createElement('div');
  p1Score.className = 'pg-score player1';
  p1Score.innerHTML = `Blue: ${state.playerChips.player1} chips | ${state.primeVeins.player1} veins`;

  const p2Score = document.createElement('div');
  p2Score.className = 'pg-score player2';
  p2Score.innerHTML = `Red: ${state.playerChips.player2} chips | ${state.primeVeins.player2} veins`;

  container.appendChild(p1Score);
  container.appendChild(p2Score);

  return container;
}

// =============================================================================
// Move History
// =============================================================================

/**
 * Render move history
 */
export function renderMoveHistory(state: PrimeGoldState): HTMLElement {
  const container = document.createElement('div');
  container.className = 'pg-move-history';

  const title = document.createElement('h3');
  title.textContent = 'Move History';
  container.appendChild(title);

  for (let i = state.moveHistory.length - 1; i >= Math.max(0, state.moveHistory.length - 10); i--) {
    const move = state.moveHistory[i];
    const moveEl = document.createElement('div');
    moveEl.className = `pg-move-item ${move.player}`;
    moveEl.innerHTML = `${getPlayerName(move.player)}: ${move.expression} = <strong>${move.result}</strong>`;
    container.appendChild(moveEl);
  }

  return container;
}
