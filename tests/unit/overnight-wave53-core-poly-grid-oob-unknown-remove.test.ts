/**
 * Overnight HEAVY leftover after #241 — Grid isValidPlacement OOB + unknown remove.
 * Distinct from wave52 grid place overwrite. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createGrid,
  isValidPlacement,
  isCellOccupied,
  placePolyomino,
  removePolyomino,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 53 core poly — grid OOB / unknown remove', () => {
  it('OOB cells count as occupied so placement is invalid', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const grid = createGrid(2, 2);
    expect(isCellOccupied(grid, -1, 0)).toBe(true);
    expect(isCellOccupied(grid, 0, 2)).toBe(true);
    expect(isValidPlacement(grid, mono, { row: -1, col: 0 })).toBe(false);
    expect(isValidPlacement(grid, mono, { row: 0, col: 2 })).toBe(false);
    expect(isValidPlacement(grid, mono, { row: 1, col: 1 })).toBe(true);
  });

  it('removePolyomino unknown id leaves occupancy and placements', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const placed = placePolyomino(createGrid(2, 2), mono, { row: 0, col: 0 });
    const after = removePolyomino(placed, 'no-such-poly');
    expect(after.cells[0][0].occupied).toBe(true);
    expect(after.placements).toHaveLength(1);
    expect(after.placements[0].polyomino.id).toBe('monomino');
  });
});
