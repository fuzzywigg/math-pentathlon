/**
 * Wave 45 — Contig calculatePoints saturated 8-neighbor interior
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { calculatePoints } from '../../src/games/contig-60/rules';

function claim(values: number[], owner: 'player1' | 'player2', base = createInitialState()): ContigState {
  const cells = new Map(base.cells);
  for (const value of values) cells.set(value, { ...cells.get(value)!, owner });
  return { ...base, cells };
}

describe('Wave 45 Contig — saturated eight neighbors', () => {
  it('scores 8 when all adjacent cells are owned', () => {
    // 35 at (2,5); neighbors: 15,16,18,32,36,60,64,66
    const state = claim([15, 16, 18, 32, 36, 60, 64, 66], 'player1');
    expect(calculatePoints(state, 35)).toBe(8);
  });
});
