/**
 * Wave 45 — Contig checkWinner player1 anti-diagonal five
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { checkWinner } from '../../src/games/contig-60/rules';

function claim(values: number[], owner: 'player1' | 'player2', base = createInitialState()): ContigState {
  const cells = new Map(base.cells);
  for (const value of values) cells.set(value, { ...cells.get(value)!, owner });
  return { ...base, cells };
}

describe('Wave 45 Contig — anti-diagonal p1', () => {
  it('detects down-left five for player1', () => {
    // (0,4)=5, (1,3)=14, (2,2)=28, (3,1)=50, (4,0)=84
    const state = claim([5, 14, 28, 50, 84], 'player1');
    expect(checkWinner(state)).toBe('player1');
  });
});
