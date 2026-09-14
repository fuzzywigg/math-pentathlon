/**
 * Overnight HEAVY leftover after #274 — countEmptyCells decrements after place.
 * Distinct from wave57 demo empty-count chrome. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  placePolyomino,
  countEmptyCells,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 58 core poly — count empty after place', () => {
  it('placing domino on 3x3 drops empty from 9 to 7', () => {
    const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    let board = createBoard(3, 3);
    expect(countEmptyCells(board)).toBe(9);
    board = placePolyomino(board, domino, { row: 0, col: 0 });
    expect(countEmptyCells(board)).toBe(7);
  });
});
