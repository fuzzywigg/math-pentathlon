/**
 * Wave 41 — Juggle doRollDice phase guard + transition matrix.
 * Non-rolling identity; rolling → selectingShape with dice. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import {
  createInitialState,
  doRollDice,
} from '../../src/games/juggle/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 juggle — doRollDice phase', () => {
  it('identity outside rolling for every other phase', () => {
    for (const phase of ['selectingShape', 'placing', 'gameOver'] as const) {
      const state = {
        ...createInitialState(),
        phase,
        currentDice: [2, 3] as [number, number],
        winner: phase === 'gameOver' ? ('player1' as const) : null,
      };
      expect(doRollDice(state)).toBe(state);
    }
  });

  it('rolling advances to selectingShape with two dice in 1..6', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // die = 1
    const next = doRollDice(createInitialState());
    expect(next).not.toBe(createInitialState());
    expect(next.phase).toBe('selectingShape');
    expect(next.currentDice).toEqual([1, 1]);
    expect(next.selectedCategory).toBeNull();
    expect(next.selectedShape).toBeNull();
  });

  it('rolling clears prior selection fields', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99); // die = 6
    const stale = {
      ...createInitialState(),
      phase: 'rolling' as const,
      selectedCategory: 'tetromino' as const,
      selectedShape: null,
      currentDice: [4, 4] as [number, number],
    };
    const next = doRollDice(stale);
    expect(next.currentDice).toEqual([6, 6]);
    expect(next.selectedCategory).toBeNull();
    expect(next.selectedShape).toBeNull();
    expect(next.phase).toBe('selectingShape');
  });
});
