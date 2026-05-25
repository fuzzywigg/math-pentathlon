// Prime Gold Game Rules
// Spiral board, prime pathways, and mathematical expressions

import {
  PrimeGoldState,
  BoardCell,
  DiceRoll,
  Player,
  MoveRecord,
  CONFIG,
  DICE_CONFIG,
  isPrime,
  generateExpressions,
} from './types';

// =============================================================================
// Board Creation - Spiral Pattern
// =============================================================================

/**
 * Create the spiral board
 * Numbers 1-49 spiral outward from center
 * Prime numbers occur along diagonal lines
 */
function createBoard(): Map<string, BoardCell> {
  const cells = new Map<string, BoardCell>();
  const size = CONFIG.BOARD_SIZE;
  const center = Math.floor(size / 2);

  // Generate spiral pattern
  const values: number[][] = Array.from({ length: size }, () => Array(size).fill(0));

  let value = 1;
  let row = center;
  let col = center;
  let direction = 0; // 0=right, 1=down, 2=left, 3=up
  let steps = 1;
  let stepCount = 0;
  let turns = 0;

  // Fill in spiral
  while (value <= size * size) {
    values[row][col] = value;
    value++;
    stepCount++;

    // Move in current direction
    const dx = [1, 0, -1, 0][direction];
    const dy = [0, 1, 0, -1][direction];
    col += dx;
    row += dy;

    // Check if we need to turn
    if (stepCount === steps) {
      stepCount = 0;
      direction = (direction + 1) % 4;
      turns++;
      if (turns === 2) {
        turns = 0;
        steps++;
      }
    }
  }

  // Create cells
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const val = values[r][c];
      if (val > 0) {
        cells.set(`${r},${c}`, {
          row: r,
          col: c,
          value: val,
          owner: null,
          isPrime: isPrime(val),
          isGoldbachTarget: val % 2 === 0 && val > 2 && val < 20, // Even numbers for Goldbach bonus
        });
      }
    }
  }

  return cells;
}

/**
 * Find cell by value
 */
export function findCellByValue(state: PrimeGoldState, value: number): BoardCell | null {
  for (const cell of state.cells.values()) {
    if (cell.value === value) {
      return cell;
    }
  }
  return null;
}

// =============================================================================
// State Management
// =============================================================================

/**
 * Create initial game state
 */
export function createInitialState(): PrimeGoldState {
  return {
    cells: createBoard(),
    currentPlayer: 'player1',
    diceRoll: null,
    phase: 'rolling',
    winner: null,
    moveHistory: [],
    playerChips: {
      player1: CONFIG.STARTING_CHIPS,
      player2: CONFIG.STARTING_CHIPS,
    },
    primeVeins: {
      player1: 0,
      player2: 0,
    },
  };
}

// =============================================================================
// Dice Rolling
// =============================================================================

/**
 * Roll the dice
 */
export function rollDice(state: PrimeGoldState): PrimeGoldState {
  if (state.phase !== 'rolling') return state;

  const diceRoll: DiceRoll = {
    die1: Math.floor(Math.random() * DICE_CONFIG.die1.max) + DICE_CONFIG.die1.min,
    die2: Math.floor(Math.random() * DICE_CONFIG.die2.max) + DICE_CONFIG.die2.min,
    die3: Math.floor(Math.random() * DICE_CONFIG.die3.max) + DICE_CONFIG.die3.min,
  };

  return {
    ...state,
    diceRoll,
    phase: 'placing',
  };
}

// =============================================================================
// Valid Moves
// =============================================================================

/**
 * Get all valid placement values given current dice
 */
export function getValidPlacements(state: PrimeGoldState): { value: number; expr: string }[] {
  if (!state.diceRoll || state.phase !== 'placing') return [];

  const expressions = generateExpressions(
    state.diceRoll.die1,
    state.diceRoll.die2,
    state.diceRoll.die3
  );

  // Filter to only empty cells
  return expressions.filter((e) => {
    const cell = findCellByValue(state, e.value);
    return cell && cell.owner === null;
  });
}

/**
 * Check if player has any valid moves
 */
export function hasValidMoves(state: PrimeGoldState): boolean {
  return getValidPlacements(state).length > 0;
}

// =============================================================================
// Chip Placement
// =============================================================================

/**
 * Place a chip on a cell
 */
export function placeChip(
  state: PrimeGoldState,
  value: number,
  expression: string
): PrimeGoldState {
  if (state.phase !== 'placing' || !state.diceRoll) return state;

  const cell = findCellByValue(state, value);
  if (!cell || cell.owner !== null) return state;

  // Verify this is a valid placement
  const validPlacements = getValidPlacements(state);
  const isValid = validPlacements.some((p) => p.value === value);
  if (!isValid) return state;

  // Update the cell
  const newCells = new Map(state.cells);
  newCells.set(`${cell.row},${cell.col}`, {
    ...cell,
    owner: state.currentPlayer,
  });

  // Record move
  const moveRecord: MoveRecord = {
    player: state.currentPlayer,
    dice: state.diceRoll,
    expression,
    result: value,
    row: cell.row,
    col: cell.col,
  };

  // Update chip count
  const newChipCount = {
    ...state.playerChips,
    [state.currentPlayer]: state.playerChips[state.currentPlayer] - 1,
  };

  // Check for diagonal prime veins
  const newVeins = countPrimeVeins(newCells, state.currentPlayer);

  // Check win condition
  let winner: Player | null = null;
  let phase: PrimeGoldState['phase'] = 'rolling';

  if (newVeins >= CONFIG.VEINS_TO_WIN) {
    winner = state.currentPlayer;
    phase = 'gameOver';
  } else if (newChipCount.player1 === 0 && newChipCount.player2 === 0) {
    // All chips placed - most veins wins
    const p1Veins = countPrimeVeins(newCells, 'player1');
    const p2Veins = countPrimeVeins(newCells, 'player2');
    phase = 'gameOver';
    if (p1Veins > p2Veins) winner = 'player1';
    else if (p2Veins > p1Veins) winner = 'player2';
  }

  const nextPlayer: Player = state.currentPlayer === 'player1' ? 'player2' : 'player1';

  return {
    ...state,
    cells: newCells,
    currentPlayer: phase === 'gameOver' ? state.currentPlayer : nextPlayer,
    diceRoll: null,
    phase,
    winner,
    moveHistory: [...state.moveHistory, moveRecord],
    playerChips: newChipCount,
    primeVeins: {
      player1: countPrimeVeins(newCells, 'player1'),
      player2: countPrimeVeins(newCells, 'player2'),
    },
  };
}

/**
 * Count diagonal prime veins for a player
 */
function countPrimeVeins(cells: Map<string, BoardCell>, player: Player): number {
  const size = CONFIG.BOARD_SIZE;
  let veins = 0;

  // Check all diagonals (both directions)
  // Top-left to bottom-right diagonals
  for (let start = -(size - 1); start < size; start++) {
    let count = 0;
    for (let i = 0; i < size; i++) {
      const row = i;
      const col = start + i;
      if (col >= 0 && col < size) {
        const cell = cells.get(`${row},${col}`);
        if (cell && cell.isPrime && cell.owner === player) {
          count++;
        } else {
          if (count >= CONFIG.MIN_VEIN_LENGTH) veins++;
          count = 0;
        }
      }
    }
    if (count >= CONFIG.MIN_VEIN_LENGTH) veins++;
  }

  // Top-right to bottom-left diagonals
  for (let start = 0; start < 2 * size - 1; start++) {
    let count = 0;
    for (let i = 0; i < size; i++) {
      const row = i;
      const col = start - i;
      if (col >= 0 && col < size) {
        const cell = cells.get(`${row},${col}`);
        if (cell && cell.isPrime && cell.owner === player) {
          count++;
        } else {
          if (count >= CONFIG.MIN_VEIN_LENGTH) veins++;
          count = 0;
        }
      }
    }
    if (count >= CONFIG.MIN_VEIN_LENGTH) veins++;
  }

  return veins;
}

// =============================================================================
// Game Flow
// =============================================================================

/**
 * Pass turn (only if no valid moves)
 */
export function passTurn(state: PrimeGoldState): PrimeGoldState {
  if (state.phase === 'gameOver') return state;

  const nextPlayer: Player = state.currentPlayer === 'player1' ? 'player2' : 'player1';

  return {
    ...state,
    currentPlayer: nextPlayer,
    diceRoll: null,
    phase: 'rolling',
  };
}
