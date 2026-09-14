/**
 * Overnight HEAVY leftover after #241 — createBoardWithBlockedCells ignores OOB.
 * Distinct from wave52 grid overwrite / preview OOB rects. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoardWithBlockedCells,
  isInBounds,
  isOccupied,
  countEmptyCells,
} from '../../src/core/polyomino';

describe('Wave 53 core poly — blocked OOB ignored', () => {
  it('out-of-bounds blocked cells do not throw or shrink in-bounds empties', () => {
    const board = createBoardWithBlockedCells(2, 2, [
      { row: -1, col: 0 },
      { row: 0, col: 99 },
      { row: 2, col: 2 },
      { row: 0, col: 0 },
    ]);
    expect(board.rows).toBe(2);
    expect(board.cols).toBe(2);
    expect(isInBounds(board, { row: 0, col: 0 })).toBe(true);
    expect(isOccupied(board, { row: 0, col: 0 })).toBe(true);
    expect(isOccupied(board, { row: 0, col: 1 })).toBe(false);
    expect(countEmptyCells(board)).toBe(3);
  });
});
