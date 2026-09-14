/**
 * Wave 41 — Contig 60 doRollDice phase guard + dice transition.
 * Non-rolling identity; rolling → calculating. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { createInitialState } from '../../src/games/contig-60/types';
import { doRollDice } from '../../src/games/contig-60/rules';

afterEach(() => vi.restoreAllMocks());

describe('Wave 41 contig-60 — doRollDice phase', () => {
  it('identity outside rolling', () => {
    for (const phase of ['calculating', 'placing', 'gameOver'] as const) {
      const state = {
        ...createInitialState(),
        phase,
        currentDice: [1, 2, 3] as [number, number, number],
        winner: phase === 'gameOver' ? ('player1' as const) : null,
      };
      expect(doRollDice(state)).toBe(state);
    }
  });

  it('rolling sets three dice and enters calculating', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // die = 1
    const next = doRollDice(createInitialState());
    expect(next.phase).toBe('calculating');
    expect(next.currentDice).toEqual([1, 1, 1]);
  });

  it('rolling with mocked mid dice still leaves calculating even if sparse', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5); // die = 4
    const next = doRollDice(createInitialState());
    expect(next.phase).toBe('calculating');
    expect(next.currentDice).toEqual([4, 4, 4]);
    expect(next.currentDice!.every((d) => d >= 1 && d <= 6)).toBe(true);
  });
});
