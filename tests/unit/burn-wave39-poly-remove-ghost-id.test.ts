/**
 * Wave 39 — removePolyomino ghost id leftover after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createGrid,
  placePolyomino,
  removePolyomino,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 39 poly — remove ghost id', () => {
  it('ghost id clears nothing; placements unchanged', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    let grid = createGrid(3, 3);
    grid = placePolyomino(grid, mono, { row: 1, col: 1 });
    expect(grid.placements).toHaveLength(1);
    expect(grid.cells[1][1].occupied).toBe(true);

    const after = removePolyomino(grid, 'ghost-missing');
    expect(after.placements).toHaveLength(1);
    expect(after.cells[1][1].occupied).toBe(true);
    expect(after.cells[1][1].polyominoId).toBe('monomino');
  });
});
