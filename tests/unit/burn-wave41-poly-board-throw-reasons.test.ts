/**
 * Wave 41 — Poly Board placePolyomino throw reasons matrix.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  placePolyomino,
  getShapeById,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 41 poly — place throw reasons', () => {
  it('throws occupied then beyond for monomino', () => {
    const mono = getShapeById('monomino', SIMPLE_SHAPES)!;
    const board = placePolyomino(createBoard(2, 2), mono, { row: 0, col: 0 }, 0, false);
    expect(() =>
      placePolyomino(board, mono, { row: 0, col: 0 }, 0, false)
    ).toThrow(/occup/i);
    expect(() =>
      placePolyomino(createBoard(2, 2), mono, { row: 5, col: 5 }, 0, false)
    ).toThrow(/beyond|bound/i);
  });
});
