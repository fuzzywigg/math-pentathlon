/**
 * Overnight HEAVY leftover after #274 — getEmptyCells length matches countEmpty.
 * Distinct from wave57 demo empty-count. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  placePolyomino,
  getEmptyCells,
  countEmptyCells,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 58 core poly — getEmptyCells count', () => {
  it('empty cell list length equals countEmptyCells after place', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    let board = createBoard(2, 2);
    board = placePolyomino(board, mono, { row: 1, col: 1 });
    expect(getEmptyCells(board)).toHaveLength(countEmptyCells(board));
    expect(countEmptyCells(board)).toBe(3);
  });
});
