/**
 * Wave 45 — Contig checkWinner dual five prefers player1 scan order
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

describe('Wave 45 Contig — dual five p1 priority', () => {
  it('returns player1 when both seats have five-in-a-row', () => {
    let state = claim([1, 2, 3, 4, 5], 'player1');
    state = claim([6, 7, 8, 9, 10], 'player2', state);
    expect(checkWinner(state)).toBe('player1');
  });
});
