/**
 * Wave 59 Contig/SD residual — Sum selectDomino ghost id identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectDomino } from '../../src/games/sum-dominoes/rules';

describe('Wave 59 sum — select ghost id', () => {
  it('returns same reference for unknown domino id', () => {
    const state = {
      ...createInitialState(),
      phase: 'placing' as const,
      currentDice: [3, 4] as [number, number],
    };
    expect(selectDomino(state, 'no-such-domino')).toBe(state);
  });
});
