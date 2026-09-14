/**
 * Overnight HEAVY leftover after #234 — Grid placePolyomino silently overwrites; Board throws.
 * Distinct from burn-wave41-poly-board-throw-reasons. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createGrid,
  createBoard,
  placePolyomino,
  isValidPlacement,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 52 core poly — grid place overwrite', () => {
  it('Grid overwrite does not throw; Board occupied throws', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const mono2 = { ...mono, id: 'mono-b' };
    const grid = createGrid(3, 3);
    const g1 = placePolyomino(grid, mono, { row: 1, col: 1 });
    expect(isValidPlacement(g1, mono2, { row: 1, col: 1 })).toBe(false);
    const g2 = placePolyomino(g1, mono2, { row: 1, col: 1 });
    expect(g2.cells[1][1].polyominoId).toBe('mono-b');
    expect(g2.placements).toHaveLength(2);

    const board = createBoard(3, 3);
    const b1 = placePolyomino(board, mono, { row: 1, col: 1 });
    expect(() => placePolyomino(b1, mono2, { row: 1, col: 1 })).toThrow();
  });
});
