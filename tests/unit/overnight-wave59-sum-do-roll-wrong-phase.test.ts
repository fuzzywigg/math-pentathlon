/**
 * Wave 59 Contig/SD residual — Sum doRollDice wrong-phase identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, doRollDice } from '../../src/games/sum-dominoes/rules';

describe('Wave 59 sum — roll wrong phase', () => {
  it('returns same reference when placing', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [2, 3] as [number, number],
    };
    expect(doRollDice(state)).toBe(state);
  });
});
