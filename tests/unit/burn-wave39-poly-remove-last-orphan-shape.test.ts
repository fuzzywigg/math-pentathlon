/**
 * Wave 39 — removeLastPolyomino orphan shape early return after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createBoard,
  placePolyomino,
  removeLastPolyomino,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 39 poly — removeLast orphan shape', () => {
  it('returns same board when last shapeId absent from shapes', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const board = placePolyomino(createBoard(2, 2), mono, { row: 0, col: 0 });
    expect(board.placements).toHaveLength(1);
    expect(board.cells[0][0]).toBe(true);

    const after = removeLastPolyomino(board, []);
    expect(after).toBe(board);
    expect(after.placements).toHaveLength(1);
    expect(after.cells[0][0]).toBe(true);
  });
});
