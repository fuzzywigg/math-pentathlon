/**
 * Wave 41 HEAVY — Prime Gold placeChip reject branch matrix.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import type { PrimeGoldState } from '../../src/games/prime-gold/types';
import {
  createInitialState,
  getValidPlacements,
  placeChip,
  findCellByValue,
} from '../../src/games/prime-gold/rules';

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

describe('Wave 41 Prime Gold — placeChip reject paths', () => {
  it('identity while still rolling (no dice placed)', () => {
    const state = createInitialState();
    expect(placeChip(state, 6, '6')).toBe(state);
  });

  it('identity when phase is gameOver even with dice present', () => {
    const state = placing(
      { die1: 2, die2: 3, die3: 4 },
      { phase: 'gameOver', winner: 'player2' }
    );
    const first = getValidPlacements({ ...state, phase: 'placing' })[0];
    expect(placeChip(state, first?.value ?? 6, first?.expr ?? '6')).toBe(state);
  });

  it('identity when diceRoll is null mid-placing', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      diceRoll: null,
    };
    expect(placeChip(state, 12, '3×4')).toBe(state);
  });

  it('identity for value with no board cell', () => {
    const state = placing({ die1: 2, die2: 3, die3: 4 });
    expect(placeChip(state, 0, '0')).toBe(state);
    expect(placeChip(state, 99, '99')).toBe(state);
  });

  it('identity when target value is not reachable from dice', () => {
    const state = placing({ die1: 1, die2: 1, die3: 1 });
    const reachable = new Set(getValidPlacements(state).map((p) => p.value));
    expect(reachable.has(47)).toBe(false);
    expect(findCellByValue(state, 47)).not.toBeNull();
    expect(placeChip(state, 47, '47')).toBe(state);
  });

  it('identity when cell already owned by either seat', () => {
    const dice = { die1: 2, die2: 3, die3: 4 };
    const base = placing(dice);
    const [target] = getValidPlacements(base);
    expect(target).toBeTruthy();

    for (const owner of ['player1', 'player2'] as const) {
      const cell = findCellByValue(base, target.value)!;
      const cells = new Map(base.cells);
      cells.set(`${cell.row},${cell.col}`, { ...cell, owner });
      const state = { ...base, cells };
      expect(placeChip(state, target.value, target.expr)).toBe(state);
    }
  });

  it('reject does not mutate chips, history, or seat', () => {
    const state = placing({ die1: 1, die2: 1, die3: 1 });
    const before = {
      chips: { ...state.playerChips },
      historyLen: state.moveHistory.length,
      seat: state.currentPlayer,
      phase: state.phase,
    };
    const rejected = placeChip(state, 40, 'fake');
    expect(rejected).toBe(state);
    expect(state.playerChips).toEqual(before.chips);
    expect(state.moveHistory).toHaveLength(before.historyLen);
    expect(state.currentPlayer).toBe(before.seat);
    expect(state.phase).toBe(before.phase);
  });
});
