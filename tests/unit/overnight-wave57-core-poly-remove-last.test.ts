/**
 * Overnight HEAVY leftover after #264 — removeLastPolyomino frees cells.
 * Distinct from wave55 board unknown shape. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  placePolyomino,
  removeLastPolyomino,
  countEmptyCells,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 57 core poly — removeLast', () => {
  it('undoes last domino and restores empty count', () => {
    const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    let board = createBoard(3, 3);
    const before = countEmptyCells(board);
    board = placePolyomino(board, domino, { row: 0, col: 0 });
    expect(board.placements).toHaveLength(1);
    board = removeLastPolyomino(board, [domino]);
    expect(board.placements).toHaveLength(0);
    expect(countEmptyCells(board)).toBe(before);
  });
});
