/**
 * Wave 38 — handshake: poly fill ratios via fraction compare.
 * Distinct from wave 37 fill handshake. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createBoard,
  placePolyomino,
  countEmptyCells,
  TETROMINOES,
  getShapeById,
} from '../../src/core/polyomino';
import {
  createFraction,
  compare,
  areEqual,
  fromWhole,
} from '../../src/core/fractions';

describe('Wave 38 handshake — poly fill vs frac', () => {
  it('empty board fill ratio is 0/N', () => {
    const board = createBoard(4, 4);
    const empty = countEmptyCells(board);
    const fill = createFraction(16 - empty, 16);
    expect(areEqual(fill, fromWhole(0))).toBe(true);
  });

  it('placing O on 4x4 yields fill 4/16 = 1/4', () => {
    const O = getShapeById('O', TETROMINOES)!;
    let board = createBoard(4, 4);
    board = placePolyomino(board, O, { row: 0, col: 0 });
    const empty = countEmptyCells(board);
    const fill = createFraction(16 - empty, 16);
    expect(compare(fill, createFraction(1, 4))).toBe(0);
  });

  it('second O increases fill above first', () => {
    const O = getShapeById('O', TETROMINOES)!;
    let board = createBoard(4, 4);
    board = placePolyomino(board, O, { row: 0, col: 0 });
    const fill1 = createFraction(16 - countEmptyCells(board), 16);
    board = placePolyomino(board, O, { row: 0, col: 2 });
    const fill2 = createFraction(16 - countEmptyCells(board), 16);
    expect(compare(fill2, fill1)).toBeGreaterThan(0);
  });
});
