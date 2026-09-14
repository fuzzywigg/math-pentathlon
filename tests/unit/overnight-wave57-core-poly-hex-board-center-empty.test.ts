/**
 * Overnight HEAVY leftover after #264 — createHexagonalBoard(1) center empty.
 * Distinct from wave56 poly mouse/inject. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createHexagonalBoard,
  countEmptyCells,
  isOccupied,
} from '../../src/core/polyomino';

describe('Wave 57 core poly — hex board radius 1', () => {
  it('center empty and corners blocked reduce empty count', () => {
    const board = createHexagonalBoard(1);
    expect(board.rows).toBe(3);
    expect(isOccupied(board, { row: 1, col: 1 })).toBe(false);
    expect(isOccupied(board, { row: 0, col: 0 })).toBe(true);
    expect(countEmptyCells(board)).toBeLessThan(9);
    expect(countEmptyCells(board)).toBeGreaterThan(0);
  });
});
