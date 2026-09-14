/**
 * Overnight HEAVY leftover after #264 — solvePlacement fills 1×1 with monomino.
 * Distinct from wave56 O flags / inject styles. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  solvePlacement,
  SIMPLE_SHAPES,
  isBoardFilled,
  placePolyomino,
} from '../../src/core/polyomino';

describe('Wave 57 core poly — solve monomino', () => {
  it('1x1 board has a one-piece monomino solution', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const board = createBoard(1, 1);
    const solutions = solvePlacement(board, [mono], 1);
    expect(solutions).toHaveLength(1);
    expect(solutions[0]).toHaveLength(1);
    const filled = placePolyomino(
      board,
      mono,
      solutions[0][0].position,
      solutions[0][0].rotation,
      solutions[0][0].flipped
    );
    expect(isBoardFilled(filled)).toBe(true);
  });
});
