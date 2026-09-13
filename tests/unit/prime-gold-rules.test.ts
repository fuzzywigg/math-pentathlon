import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  isPrime,
  factorial,
  generateExpressions,
  isGoldbachNumber,
  PrimeGoldState,
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

function placingState(
  dice: { die1: number; die2: number; die3: number },
  overrides: Partial<PrimeGoldState> = {}
): PrimeGoldState {
  return {
    ...createInitialState(),
    diceRoll: dice,
    phase: 'placing',
    ...overrides,
  };
}

describe('Prime Gold – pure math helpers', () => {
  it.each([
    [1, false],
    [2, true],
    [3, true],
    [4, false],
    [9, false],
    [47, true],
  ])('isPrime(%i) → %s', (n, expected) => {
    expect(isPrime(n)).toBe(expected);
  });

  it('computes factorials within the supported range', () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(5)).toBe(120);
    expect(factorial(11)).toBeNaN();
    expect(factorial(-1)).toBeNaN();
  });

  it('generateExpressions includes basic sums and products', () => {
    const exprs = generateExpressions(2, 3, 4);
    const values = exprs.map((e) => e.value);
    expect(values).toContain(2);
    expect(values).toContain(9); // 2+3+4 or 3*3
    expect(values).toContain(24); // 2*3*4 path or factorial
    expect(exprs.every((e) => e.value > 0 && e.value <= 49)).toBe(true);
  });

  it('isGoldbachNumber recognizes even sums of two primes', () => {
    expect(isGoldbachNumber(10)).toBe(true);
    expect(isGoldbachNumber(4)).toBe(true);
    expect(isGoldbachNumber(7)).toBe(false);
    expect(isGoldbachNumber(2)).toBe(false);
  });
});

describe('Prime Gold – dice and placement', () => {
  it('rollDice transitions to placing with three faces', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const next = rollDice(createInitialState());
    expect(next.phase).toBe('placing');
    expect(next.diceRoll).toEqual({ die1: 1, die2: 1, die3: 1 });
  });

  it('is a no-op when not rolling', () => {
    const state = placingState({ die1: 2, die2: 3, die3: 4 });
    expect(rollDice(state)).toBe(state);
  });

  it('getValidPlacements filters to empty cells only', () => {
    const state = placingState({ die1: 2, die2: 3, die3: 4 });
    const placements = getValidPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    expect(hasValidMoves(state)).toBe(true);

    for (const p of placements) {
      const cell = findCellByValue(state, p.value);
      expect(cell?.owner).toBeNull();
    }
  });

  it('placeChip claims a cell, records history, and flips seat', () => {
    const state = placingState({ die1: 2, die2: 3, die3: 4 });
    const [first] = getValidPlacements(state);
    expect(first).toBeTruthy();

    const next = placeChip(state, first.value, first.expr);
    expect(findCellByValue(next, first.value)?.owner).toBe('player1');
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.moveHistory).toHaveLength(1);
    expect(next.playerChips.player1).toBe(19);
  });

  it('rejects placing on an already owned value', () => {
    let state = placingState({ die1: 2, die2: 3, die3: 4 });
    const [first] = getValidPlacements(state);
    state = placeChip(state, first.value, first.expr);

    // Force same dice again for player2
    state = placingState(
      { die1: 2, die2: 3, die3: 4 },
      {
        cells: state.cells,
        currentPlayer: 'player2',
        playerChips: state.playerChips,
        moveHistory: state.moveHistory,
      }
    );
    const illegal = placeChip(state, first.value, first.expr);
    expect(illegal).toBe(state);
  });

  it('passTurn clears dice and flips the player', () => {
    const state = placingState({ die1: 1, die2: 1, die3: 1 });
    const next = passTurn(state);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('rolling');
    expect(next.diceRoll).toBeNull();
  });
});
