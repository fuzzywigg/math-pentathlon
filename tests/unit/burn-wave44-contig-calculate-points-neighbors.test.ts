/**
 * Wave 44 — Contig calculatePoints neighbor ladder leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { ContigState, createInitialState } from '../../src/games/contig-60/types';
import { calculatePoints } from '../../src/games/contig-60/rules';

function claim(state: ContigState, values: number[], owner: 'player1' | 'player2'): ContigState {
  const cells = new Map(state.cells);
  for (const v of values) cells.set(v, { ...cells.get(v)!, owner });
  return { ...state, cells };
}

describe('Wave 44 Contig — calculatePoints neighbors', () => {
  it('scores one point per owned adjacent cell', () => {
    // 1 at (0,0); neighbors include 2
    let s = claim(createInitialState(), [2], 'player1');
    expect(calculatePoints(s, 1)).toBe(1);
    s = claim(s, [11], 'player2');
    expect(calculatePoints(s, 1)).toBe(2);
  });
});
