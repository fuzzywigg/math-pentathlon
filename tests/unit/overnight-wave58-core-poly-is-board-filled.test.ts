/**
 * Overnight HEAVY leftover after #274 — isBoardFilled after tiling monominoes.
 * Distinct from wave57 canPlace-full-false. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  placePolyomino,
  isBoardFilled,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 58 core poly — isBoardFilled', () => {
  it('1x1 board filled after monomino place', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    let board = createBoard(1, 1);
    expect(isBoardFilled(board)).toBe(false);
    board = placePolyomino(board, mono, { row: 0, col: 0 });
    expect(isBoardFilled(board)).toBe(true);
  });
});
