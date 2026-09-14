/**
 * Wave 58 Contig/SD residual — Contig calculatePoints ignores null grid holes. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/contig-60/types';
import { calculatePoints } from '../../src/games/contig-60/rules';

describe('Wave 58 contig — null grid hole', () => {
  it('adjacent null grid entry does not add points', () => {
    const base = createInitialState();
    const cells = new Map(base.cells);
    const center = cells.get(12)!; // row1 col1 typically
    // Own a neighbor
    const right = cells.get(13);
    if (right) cells.set(13, { ...right, owner: 'player1' });
    const grid = base.grid.map((row) => [...row]);
    // Punch a hole next to 12 if in bounds
    const holeRow = center.row;
    const holeCol = center.col - 1;
    if (holeCol >= 0) grid[holeRow][holeCol] = null;
    const state = { ...base, cells, grid };
    const pts = calculatePoints(state, 12);
    // Only owned non-null adjacents count — at most the owned 13
    expect(pts).toBeLessThanOrEqual(1);
    expect(pts).toBeGreaterThanOrEqual(0);
  });
});
