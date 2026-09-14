/**
 * Wave 59 Contig/SD residual — Contig doRollDice wrong-phase identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { doRollDice } from '../../src/games/contig-60/rules';

describe('Wave 59 contig — roll wrong phase', () => {
  it('returns same reference when calculating', () => {
    const state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 2, 3] as [number, number, number],
    };
    expect(doRollDice(state)).toBe(state);
  });
});
