// Prime Gold Types
// Strategy-chance game with primes, exponents, and factorials

export type Player = 'player1' | 'player2';

export interface BoardCell {
  row: number;
  col: number;
  value: number;
  owner: Player | null;
  isPrime: boolean;
  isGoldbachTarget: boolean; // Special cells for Goldbach bonuses
}

export interface DiceRoll {
  die1: number;
  die2: number;
  die3: number;
}

export interface MoveRecord {
  player: Player;
  dice: DiceRoll;
  expression: string;
  result: number;
  row: number;
  col: number;
}

export interface PrimeGoldState {
  cells: Map<string, BoardCell>; // key: "row,col"
  currentPlayer: Player;
  diceRoll: DiceRoll | null;
  phase: 'rolling' | 'placing' | 'gameOver';
  winner: Player | null;
  moveHistory: MoveRecord[];
  playerChips: Record<Player, number>;
  primeVeins: Record<Player, number>; // Count of diagonal prime veins
}

// Configuration
export const CONFIG = {
  BOARD_SIZE: 7, // 7x7 spiral board
  STARTING_CHIPS: 20,
  VEINS_TO_WIN: 4, // 4 diagonal veins of primes to win
  MIN_VEIN_LENGTH: 4, // Minimum chips in a diagonal to count as a vein
};

// Dice faces for the three dice (d6, d8, d10 style ranges)
export const DICE_CONFIG = {
  die1: { min: 1, max: 6 },
  die2: { min: 1, max: 8 },
  die3: { min: 1, max: 10 },
};

/**
 * Check if a number is prime
 */
export function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/**
 * Calculate factorial (limited to reasonable values)
 */
export function factorial(n: number): number {
  if (n < 0 || n > 10) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

/**
 * Generate all possible expressions from three dice values
 * Returns expressions and their results
 */
export function generateExpressions(d1: number, d2: number, d3: number): { expr: string; value: number }[] {
  const results: { expr: string; value: number }[] = [];
  const seen = new Set<number>();

  // Helper to add unique results
  const addResult = (expr: string, value: number) => {
    if (!isNaN(value) && isFinite(value) && value > 0 && value <= 49 && Number.isInteger(value)) {
      if (!seen.has(value)) {
        seen.add(value);
        results.push({ expr, value });
      }
    }
  };

  // Basic values (can use factorials on any)
  const vals = [
    { v: d1, s: d1.toString() },
    { v: d2, s: d2.toString() },
    { v: d3, s: d3.toString() },
    { v: factorial(d1), s: `${d1}!` },
    { v: factorial(d2), s: `${d2}!` },
    { v: factorial(d3), s: `${d3}!` },
  ].filter((x) => !isNaN(x.v) && isFinite(x.v));

  // Single values
  vals.forEach(({ v, s }) => addResult(s, v));

  // Two-value operations
  for (let i = 0; i < vals.length; i++) {
    for (let j = 0; j < vals.length; j++) {
      if (i === j) continue;
      const { v: a, s: sa } = vals[i];
      const { v: b, s: sb } = vals[j];

      addResult(`${sa} + ${sb}`, a + b);
      addResult(`${sa} - ${sb}`, a - b);
      addResult(`${sa} × ${sb}`, a * b);
      if (b !== 0 && a % b === 0) addResult(`${sa} ÷ ${sb}`, a / b);
      if (b <= 5 && a <= 10) addResult(`${sa}^${sb}`, Math.pow(a, b));
    }
  }

  // Three-value operations (simplified to common patterns)
  const basicVals = [
    { v: d1, s: d1.toString() },
    { v: d2, s: d2.toString() },
    { v: d3, s: d3.toString() },
  ];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        if (i === j || j === k || i === k) continue;
        const a = basicVals[i];
        const b = basicVals[j];
        const c = basicVals[k];

        // (a + b) + c, (a + b) - c, etc.
        addResult(`(${a.s} + ${b.s}) + ${c.s}`, a.v + b.v + c.v);
        addResult(`(${a.s} + ${b.s}) - ${c.s}`, a.v + b.v - c.v);
        addResult(`(${a.s} + ${b.s}) × ${c.s}`, (a.v + b.v) * c.v);
        addResult(`(${a.s} - ${b.s}) × ${c.s}`, (a.v - b.v) * c.v);
        addResult(`(${a.s} × ${b.s}) + ${c.s}`, a.v * b.v + c.v);
        addResult(`(${a.s} × ${b.s}) - ${c.s}`, a.v * b.v - c.v);
        if (c.v !== 0 && (a.v * b.v) % c.v === 0) {
          addResult(`(${a.s} × ${b.s}) ÷ ${c.s}`, (a.v * b.v) / c.v);
        }
        if (b.v !== 0 && a.v % b.v === 0) {
          addResult(`(${a.s} ÷ ${b.s}) + ${c.s}`, a.v / b.v + c.v);
          addResult(`(${a.s} ÷ ${b.s}) × ${c.s}`, (a.v / b.v) * c.v);
        }
      }
    }
  }

  return results.sort((a, b) => a.value - b.value);
}

/**
 * Check Goldbach's conjecture application
 * Even numbers > 2 can be expressed as sum of two primes
 */
export function isGoldbachNumber(n: number): boolean {
  if (n <= 2 || n % 2 !== 0) return false;
  // Check if n = p1 + p2 where both are prime
  for (let p1 = 2; p1 <= n / 2; p1++) {
    if (isPrime(p1) && isPrime(n - p1)) {
      return true;
    }
  }
  return false;
}
