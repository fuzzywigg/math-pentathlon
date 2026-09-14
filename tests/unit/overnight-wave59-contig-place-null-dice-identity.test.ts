/**
 * Wave 59 Contig/SD residual — Contig placeChip null-dice identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 59 contig — place null dice', () => {
  it('returns same reference when calculating but currentDice null', () => {
    const state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: null,
    };
    expect(placeChip(state, 12, '(1 + 2) * 4')).toBe(state);
  });
});
