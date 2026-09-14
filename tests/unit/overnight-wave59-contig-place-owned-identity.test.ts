/**
 * Wave 59 Contig/SD residual — Contig placeChip owned cell identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 59 contig — place owned identity', () => {
  it('returns same reference when target already owned', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    const cell = cells.get(12)!;
    cells.set(12, { ...cell, owner: 'player2' });
    const state = {
      ...base,
      cells,
      phase: 'calculating' as const,
      currentDice: [2, 3, 4] as [number, number, number],
    };
    expect(placeChip(state, 12, '(2 + 3) + 7')).toBe(state);
  });
});
