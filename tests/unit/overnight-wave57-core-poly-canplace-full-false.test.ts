/**
 * Overnight HEAVY leftover after #264 — canPlaceShape false on full board.
 * Distinct from wave53 handshake empty-true. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  placePolyomino,
  canPlaceShape,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 57 core poly — canPlaceShape full', () => {
  it('full 1x1 rejects another monomino', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const board = placePolyomino(createBoard(1, 1), mono, { row: 0, col: 0 });
    expect(canPlaceShape(board, mono)).toBe(false);
  });
});
