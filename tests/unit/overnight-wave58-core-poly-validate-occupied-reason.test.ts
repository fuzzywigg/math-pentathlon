/**
 * Overnight HEAVY leftover after #274 — validatePlacement occupied reason.
 * Distinct from wave57 placements-overlap / canPlace-full. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  placePolyomino,
  validatePlacement,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 58 core poly — validate occupied reason', () => {
  it('overlap reports Space is already occupied', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    let board = createBoard(3, 3);
    board = placePolyomino(board, mono, { row: 0, col: 0 });
    const result = validatePlacement(board, mono, { row: 0, col: 0 });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('Space is already occupied');
  });
});
