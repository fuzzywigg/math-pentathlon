/**
 * Wave 44 — createHexagonalBoard radius-1 leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createHexagonalBoard,
  countEmptyCells,
  isBoardFilled,
} from '../../src/core/polyomino';

describe('Wave 44 poly — hex board radius 1', () => {
  it('size 3 and not filled; empty < 9', () => {
    const board = createHexagonalBoard(1);
    expect(board.rows).toBe(3);
    expect(board.cols).toBe(3);
    expect(isBoardFilled(board)).toBe(false);
    const empty = countEmptyCells(board);
    expect(empty).toBeGreaterThan(0);
    expect(empty).toBeLessThan(9);
  });
});
