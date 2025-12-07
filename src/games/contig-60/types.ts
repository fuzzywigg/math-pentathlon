// Contig 60 Game Types
// A math strategy game combining dice, expressions, and alignment

export type Player = 'player1' | 'player2';

// A cell on the Contig board
export interface ContigCell {
  value: number;        // The number displayed on this cell
  owner: Player | null; // Who has marked this cell
  row: number;
  col: number;
}

// Game state
export interface ContigState {
  cells: Map<number, ContigCell>; // Map from value to cell
  grid: (number | null)[][];       // 2D grid for adjacency (value at each position)
  currentPlayer: Player;
  currentDice: [number, number, number] | null; // Current dice roll
  currentExpression: string | null;             // Expression being built
  scores: { player1: number; player2: number };
  consecutivePasses: { player1: number; player2: number };
  winner: Player | null;
  moveHistory: ContigMove[];
  phase: 'rolling' | 'calculating' | 'placing' | 'gameOver';
}

// A move in the game
export interface ContigMove {
  player: Player;
  dice: [number, number, number];
  expression: string;
  result: number;
  points: number;
  moveNumber: number;
}

// Configuration
export const CONFIG = {
  GRID_ROWS: 6,
  GRID_COLS: 10,
  MAX_CONSECUTIVE_PASSES: 3,  // Eliminated after 3 passes
  WIN_BY_ALIGNMENT: 5,        // 5 in a row to win (optional)
};

// The Contig 60 board numbers (6x10 grid = 60 cells)
// These are carefully chosen numbers that can be made from 3 dice + operations
export const BOARD_NUMBERS: number[][] = [
  [1,   2,   3,   4,   5,   6,   7,   8,   9,   10],
  [11,  12,  13,  14,  15,  16,  18,  20,  21,  24],
  [25,  27,  28,  30,  32,  35,  36,  40,  42,  45],
  [48,  50,  54,  55,  60,  64,  66,  72,  75,  80],
  [84,  90,  96,  100, 108, 120, 125, 144, 150, 180],
  [216, 125, 100, 90,  80,  75,  72,  66,  64,  60],
];

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Get opponent
 */
export function getOpponent(player: Player): Player {
  return player === 'player1' ? 'player2' : 'player1';
}

/**
 * Get all adjacent cells for a position
 */
export function getAdjacentPositions(row: number, col: number): { row: number; col: number }[] {
  const adjacent: { row: number; col: number }[] = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1],
  ];

  for (const [dr, dc] of directions) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < CONFIG.GRID_ROWS && nc >= 0 && nc < CONFIG.GRID_COLS) {
      adjacent.push({ row: nr, col: nc });
    }
  }

  return adjacent;
}

/**
 * Create initial board
 */
export function createBoard(): { cells: Map<number, ContigCell>; grid: (number | null)[][] } {
  const cells = new Map<number, ContigCell>();
  const grid: (number | null)[][] = [];

  for (let row = 0; row < CONFIG.GRID_ROWS; row++) {
    grid[row] = [];
    for (let col = 0; col < CONFIG.GRID_COLS; col++) {
      const value = BOARD_NUMBERS[row][col];
      grid[row][col] = value;

      if (!cells.has(value)) {
        cells.set(value, {
          value,
          owner: null,
          row,
          col,
        });
      }
    }
  }

  return { cells, grid };
}

/**
 * Create initial game state
 */
export function createInitialState(): ContigState {
  const { cells, grid } = createBoard();

  return {
    cells,
    grid,
    currentPlayer: 'player1',
    currentDice: null,
    currentExpression: null,
    scores: { player1: 0, player2: 0 },
    consecutivePasses: { player1: 0, player2: 0 },
    winner: null,
    moveHistory: [],
    phase: 'rolling',
  };
}

/**
 * Roll three dice
 */
export function rollDice(): [number, number, number] {
  return [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
  ];
}

// =============================================================================
// Expression Evaluation
// =============================================================================

type Operator = '+' | '-' | '*' | '/';
const OPERATORS: Operator[] = ['+', '-', '*', '/'];

/**
 * Evaluate an expression
 */
function evaluate(a: number, op: Operator, b: number): number | null {
  switch (op) {
    case '+': return a + b;
    case '-': return a - b;
    case '*': return a * b;
    case '/': return b !== 0 && a % b === 0 ? a / b : null; // Must divide evenly
  }
}

/**
 * Get all possible results from three dice using two operations
 * Returns array of { result, expression } pairs
 */
export function getAllPossibleResults(dice: [number, number, number]): { result: number; expression: string }[] {
  const [a, b, c] = dice;
  const results: Map<number, string> = new Map();

  // Try all orderings of the three dice
  const orderings = [
    [a, b, c], [a, c, b],
    [b, a, c], [b, c, a],
    [c, a, b], [c, b, a],
  ];

  for (const [x, y, z] of orderings) {
    for (const op1 of OPERATORS) {
      for (const op2 of OPERATORS) {
        // (x op1 y) op2 z
        const intermediate1 = evaluate(x, op1, y);
        if (intermediate1 !== null) {
          const result1 = evaluate(intermediate1, op2, z);
          if (result1 !== null && result1 > 0 && Number.isInteger(result1)) {
            const expr1 = `(${x} ${op1} ${y}) ${op2} ${z}`;
            if (!results.has(result1)) {
              results.set(result1, expr1);
            }
          }
        }

        // x op1 (y op2 z)
        const intermediate2 = evaluate(y, op2, z);
        if (intermediate2 !== null) {
          const result2 = evaluate(x, op1, intermediate2);
          if (result2 !== null && result2 > 0 && Number.isInteger(result2)) {
            const expr2 = `${x} ${op1} (${y} ${op2} ${z})`;
            if (!results.has(result2)) {
              results.set(result2, expr2);
            }
          }
        }
      }
    }
  }

  return Array.from(results.entries())
    .map(([result, expression]) => ({ result, expression }))
    .sort((a, b) => a.result - b.result);
}

/**
 * Get valid placements (results that are on the board and not taken)
 */
export function getValidPlacements(
  state: ContigState,
  dice: [number, number, number]
): { result: number; expression: string }[] {
  const possible = getAllPossibleResults(dice);

  return possible.filter(({ result }) => {
    const cell = state.cells.get(result);
    return cell && cell.owner === null;
  });
}
