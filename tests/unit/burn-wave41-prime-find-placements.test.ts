/**
 * Wave 41 HEAVY — Prime Gold findCellByValue / getValidPlacements / hasValidMoves.
 * Deep branch matrices beyond empty-valids pass (wave35).
 */
import { describe, it, expect } from 'vitest';
import { generateExpressions } from '../../src/games/prime-gold/types';
import {
  createInitialState,
  findCellByValue,
  getValidPlacements,
  hasValidMoves,
} from '../../src/games/prime-gold/rules';
import type { PrimeGoldState } from '../../src/games/prime-gold/types';

function placing(
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

describe('Wave 41 Prime Gold — findCellByValue matrix', () => {
  it.each([1, 7, 25, 49] as const)('locates spiral value %i', (value) => {
    const cell = findCellByValue(createInitialState(), value);
    expect(cell?.value).toBe(value);
    expect(cell?.owner).toBeNull();
  });

  it.each([0, -1, 50, 100] as const)('returns null for off-board %i', (value) => {
    expect(findCellByValue(createInitialState(), value)).toBeNull();
  });

  it('survives after claiming a cell (same value still found, now owned)', () => {
    const state = createInitialState();
    const cell = findCellByValue(state, 11)!;
    const cells = new Map(state.cells);
    cells.set(`${cell.row},${cell.col}`, { ...cell, owner: 'player2' });
    const next = { ...state, cells };
    const found = findCellByValue(next, 11);
    expect(found?.owner).toBe('player2');
    expect(found?.row).toBe(cell.row);
  });
});

describe('Wave 41 Prime Gold — getValidPlacements / hasValidMoves branches', () => {
  it('empty when rolling (no dice) or wrong phase', () => {
    const open = createInitialState();
    expect(getValidPlacements(open)).toEqual([]);
    expect(hasValidMoves(open)).toBe(false);

    const placingNoDice = { ...open, phase: 'placing' as const, diceRoll: null };
    expect(getValidPlacements(placingNoDice)).toEqual([]);
    expect(hasValidMoves(placingNoDice)).toBe(false);

    const over = placing(
      { die1: 2, die2: 3, die3: 4 },
      { phase: 'gameOver', winner: 'player1' }
    );
    expect(getValidPlacements(over)).toEqual([]);
    expect(hasValidMoves(over)).toBe(false);
  });

  it('matches generateExpressions values that land on empty cells', () => {
    const dice = { die1: 2, die2: 3, die3: 5 };
    const state = placing(dice);
    const expressions = generateExpressions(2, 3, 5);
    const placements = getValidPlacements(state);
    expect(placements.length).toBeGreaterThan(0);
    expect(hasValidMoves(state)).toBe(true);
    for (const p of placements) {
      expect(expressions.some((e) => e.value === p.value)).toBe(true);
      expect(findCellByValue(state, p.value)?.owner).toBeNull();
    }
  });

  it('partial ownership shrinks but does not empty the set', () => {
    const state = placing({ die1: 1, die2: 2, die3: 3 });
    const all = getValidPlacements(state);
    expect(all.length).toBeGreaterThan(2);
    const claim = all.slice(0, Math.ceil(all.length / 2));
    const cells = new Map(state.cells);
    for (const p of claim) {
      const cell = findCellByValue(state, p.value)!;
      cells.set(`${cell.row},${cell.col}`, { ...cell, owner: 'player1' });
    }
    const next = { ...state, cells };
    const remaining = getValidPlacements(next);
    expect(remaining.length).toBe(all.length - claim.length);
    expect(hasValidMoves(next)).toBe(remaining.length > 0);
    for (const p of remaining) {
      expect(claim.some((c) => c.value === p.value)).toBe(false);
    }
  });

  it('dice that only produce owned targets → no moves', () => {
    let state = placing({ die1: 2, die2: 2, die3: 2 });
    const targets = getValidPlacements(state);
    expect(targets.length).toBeGreaterThan(0);
    const cells = new Map(state.cells);
    for (const p of targets) {
      const cell = findCellByValue(state, p.value)!;
      cells.set(`${cell.row},${cell.col}`, { ...cell, owner: 'player2' });
    }
    state = { ...state, cells };
    expect(getValidPlacements(state)).toEqual([]);
    expect(hasValidMoves(state)).toBe(false);
  });

  it('unique values only — no duplicate placement entries', () => {
    const placements = getValidPlacements(placing({ die1: 4, die2: 5, die3: 6 }));
    const values = placements.map((p) => p.value);
    expect(new Set(values).size).toBe(values.length);
  });
});
