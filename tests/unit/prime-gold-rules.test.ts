import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  isPrime,
  factorial,
  generateExpressions,
  isGoldbachNumber,
} from '../../src/games/prime-gold/types';
import {
  createInitialState,
  rollDice,
  getValidPlacements,
  placeChip,
  passTurn,
  hasValidMoves,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Prime Gold – number helpers', () => {
  it.each([
    [2, true],
    [3, true],
    [4, false],
    [5, true],
    [9, false],
    [17, true],
    [1, false],
    [0, false],
    [15, false],
  ] as const)('isPrime(%i) === %s', (n, expected) => {
    expect(isPrime(n)).toBe(expected);
  });

  it('factorial(5) === 120 and factorial(11) === NaN', () => {
    expect(factorial(5)).toBe(120);
    expect(factorial(11)).toBeNaN();
  });

  it('generateExpressions(2,3,4) includes sums and products', () => {
    const exprs = generateExpressions(2, 3, 4);
    const values = exprs.map((e) => e.value);

    expect(values).toContain(9); // 2+3+4 or 5+4 etc.
    expect(values).toContain(6); // 2*3
    expect(values).toContain(24); // 2*3*4 via (2×3)×4 or similar if ≤49
    expect(exprs.every((e) => typeof e.expr === 'string')).toBe(true);
  });

  it('isGoldbachNumber recognizes even sums of primes', () => {
    expect(isGoldbachNumber(10)).toBe(true); // 3+7 or 5+5
    expect(isGoldbachNumber(7)).toBe(false);
    expect(isGoldbachNumber(2)).toBe(false);
  });
});

describe('Prime Gold – dice and placement', () => {
  it('rollDice with Math.random mocked produces expected faces', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const next = rollDice(state);

    expect(next.phase).toBe('placing');
    expect(next.diceRoll).toEqual({ die1: 1, die2: 1, die3: 1 });
  });

  it('placeChip owns cell and flips player', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    let state = createInitialState();
    state = rollDice(state);
    expect(state.diceRoll).not.toBeNull();

    const placements = getValidPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    expect(hasValidMoves(state)).toBe(true);

    const { value, expr } = placements[0];
    const cellBefore = findCellByValue(state, value);
    expect(cellBefore?.owner).toBeNull();

    const next = placeChip(state, value, expr);
    const cellAfter = findCellByValue(next, value);

    expect(cellAfter?.owner).toBe('player1');
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.diceRoll).toBeNull();
    expect(next.moveHistory).toHaveLength(1);
  });

  it('placeChip on occupied cell is a no-op', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = createInitialState();
    state = rollDice(state);

    const placements = getValidPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    const { value, expr } = placements[0];

    state = placeChip(state, value, expr);
    // Re-enter placing with same dice target already owned
    state = {
      ...state,
      phase: 'placing',
      diceRoll: { die1: 1, die2: 1, die3: 1 },
      currentPlayer: 'player2',
    };
    const before = state;
    expect(placeChip(state, value, expr)).toBe(before);
  });

  it('passTurn flips player and returns to rolling', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      diceRoll: { die1: 1, die2: 2, die3: 3 },
    };
    const next = passTurn(state);

    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.diceRoll).toBeNull();
  });
});
