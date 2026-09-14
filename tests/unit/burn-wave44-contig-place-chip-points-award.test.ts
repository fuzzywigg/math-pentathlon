/**
 * Wave 44 — Contig placeChip points award leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 44 Contig — placeChip points award', () => {
  it('adds adjacency points to placer score', () => {
    let base = createInitialState();
    const cells = new Map(base.cells);
    cells.set(1, { ...cells.get(1)!, owner: 'player2' });
    base = { ...base, cells };
    const next = placeChip(
      { ...base, phase: 'calculating', currentDice: [1, 1, 1] },
      2,
      '1+1'
    );
    expect(next.scores.player1).toBeGreaterThanOrEqual(1);
    expect(next.moveHistory[0].points).toBe(next.scores.player1);
  });
});
