/**
 * Wave 39 — solvePlacement empty / unfillable leftovers after #172/#173.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createBoard,
  placePolyomino,
  solvePlacement,
  isBoardFilled,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 39 poly — solve empty unfillable', () => {
  it('already-filled board with empty shapes → [[]] solution', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    let board = createBoard(1, 1);
    board = placePolyomino(board, mono, { row: 0, col: 0 });
    expect(isBoardFilled(board)).toBe(true);
    const sols = solvePlacement(board, [], 1);
    expect(sols).toHaveLength(1);
    expect(sols[0]).toEqual(board.placements);
  });

  it('empty shapes on unfilled board → []', () => {
    const board = createBoard(2, 2);
    expect(solvePlacement(board, [], 1)).toEqual([]);
  });

  it('maxSolutions caps monomino fill of 1x2', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const board = createBoard(1, 2);
    const sols = solvePlacement(board, [mono, mono], 1);
    expect(sols.length).toBeLessThanOrEqual(1);
    expect(sols.length).toBe(1);
    expect(sols[0]).toHaveLength(2);
  });
});
