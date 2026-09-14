/**
 * Wave 38 — findPlacementAtCell / removeLast / blocked miss leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createBoard,
  createBoardWithBlockedCells,
  placePolyomino,
  findPlacementAtCell,
  removeLastPolyomino,
  TETROMINOES,
  getShapeById,
} from '../../src/core/polyomino';

describe('Wave 38 poly-find — miss / remove / blocked', () => {
  it('empty board miss returns undefined', () => {
    const board = createBoard(8, 8);
    expect(
      findPlacementAtCell(board, { row: 0, col: 0 }, TETROMINOES)
    ).toBeUndefined();
  });

  it('hit after place then miss after removeLast', () => {
    const O = getShapeById('O', TETROMINOES)!;
    let board = createBoard(8, 8);
    board = placePolyomino(board, O, { row: 1, col: 1 });
    expect(
      findPlacementAtCell(board, { row: 1, col: 1 }, TETROMINOES)
    ).toBeDefined();
    expect(
      findPlacementAtCell(board, { row: 1, col: 2 }, TETROMINOES)
    ).toBeDefined();
    board = removeLastPolyomino(board, TETROMINOES);
    expect(
      findPlacementAtCell(board, { row: 1, col: 1 }, TETROMINOES)
    ).toBeUndefined();
    expect(board.placements).toHaveLength(0);
  });

  it('removeLast on empty board is identity', () => {
    const board = createBoard(4, 4);
    const next = removeLastPolyomino(board, TETROMINOES);
    expect(next).toBe(board);
    expect(next.placements).toEqual([]);
  });

  it('blocked cell rejects placement via throw', () => {
    const O = getShapeById('O', TETROMINOES)!;
    const board = createBoardWithBlockedCells(6, 6, [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
    ]);
    expect(() => placePolyomino(board, O, { row: 0, col: 0 })).toThrow(
      /occupied|Invalid/i
    );
    expect(
      findPlacementAtCell(board, { row: 0, col: 0 }, TETROMINOES)
    ).toBeUndefined();
  });
});
