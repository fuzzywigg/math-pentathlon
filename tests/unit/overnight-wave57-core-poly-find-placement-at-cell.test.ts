/**
 * Overnight HEAVY leftover after #264 — findPlacementAtCell hit/miss.
 * Distinct from wave55 validpos after occupy. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoard,
  placePolyomino,
  findPlacementAtCell,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 57 core poly — findPlacementAtCell', () => {
  it('returns placement on covered cell and undefined on empty', () => {
    const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    const board = placePolyomino(createBoard(3, 3), domino, {
      row: 1,
      col: 1,
    });
    expect(
      findPlacementAtCell(board, { row: 1, col: 2 }, [domino])?.shapeId
    ).toBe('domino');
    expect(
      findPlacementAtCell(board, { row: 0, col: 0 }, [domino])
    ).toBeUndefined();
  });
});
