/**
 * Wave 43 — Contig calculatePoints counts any-owner adjacents. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { calculatePoints } from '../../src/games/contig-60/rules';

describe('Wave 43 contig — points any-owner adjacent', () => {
  it('counts own and opponent neighbors alike', () => {
    const state = createInitialState();
    // cell value 5 at (0,4); neighbors 4 and 6 on row0, and 15 below etc.
    state.cells.get(4)!.owner = 'player1';
    state.cells.get(6)!.owner = 'player2';
    const pts = calculatePoints(state, 5);
    expect(pts).toBeGreaterThanOrEqual(2);
  });
});
