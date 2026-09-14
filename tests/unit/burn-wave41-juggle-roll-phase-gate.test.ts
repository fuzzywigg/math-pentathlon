/**
 * Wave 41 — Juggle doRollDice phase-gate leftovers. Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, doRollDice } from '../../src/games/juggle/rules';
import type { JuggleState } from '../../src/games/juggle/types';

afterEach(() => vi.restoreAllMocks());

const PHASES: JuggleState['phase'][] = [
  'rolling',
  'selectingShape',
  'placing',
  'gameOver',
];

describe('Wave 41 Juggle — doRollDice phase gate', () => {
  it('advances rolling → selectingShape with two dice in 1..6', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const next = doRollDice(createInitialState());
    expect(next.phase).toBe('selectingShape');
    expect(next.currentDice).not.toBeNull();
    expect(next.currentDice![0]).toBeGreaterThanOrEqual(1);
    expect(next.currentDice![0]).toBeLessThanOrEqual(6);
    expect(next.currentDice![1]).toBeGreaterThanOrEqual(1);
    expect(next.currentDice![1]).toBeLessThanOrEqual(6);
    expect(next.selectedCategory).toBeNull();
    expect(next.selectedShape).toBeNull();
  });

  it('is identity reject for every non-rolling phase', () => {
    for (const phase of PHASES) {
      if (phase === 'rolling') continue;
      const state: JuggleState = {
        ...createInitialState(),
        phase,
        currentDice: phase === 'gameOver' ? null : ([3, 4] as [number, number]),
        winner: phase === 'gameOver' ? 'player1' : null,
      };
      expect(doRollDice(state)).toBe(state);
    }
  });

  it('clears prior selection fields when re-rolling from a forged rolling state', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const forged: JuggleState = {
      ...createInitialState(),
      phase: 'rolling',
      selectedCategory: 'tetromino',
      selectedShape: null,
      currentDice: [4, 5],
    };
    const next = doRollDice(forged);
    expect(next.selectedCategory).toBeNull();
    expect(next.selectedShape).toBeNull();
    expect(next.currentDice).toEqual([1, 1]);
  });
});
