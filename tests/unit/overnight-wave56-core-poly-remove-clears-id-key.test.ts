/**
 * Overnight HEAVY leftover after #256 — removePolyomino resets cell to
 * { occupied: false } without leftover polyominoId key. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createGrid,
  placePolyomino,
  removePolyomino,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 56 core poly — remove clears polyominoId key', () => {
  it('cleared cell equals { occupied: false }', () => {
    const mono = SIMPLE_SHAPES.find((s) => s.id === 'monomino')!;
    const placed = placePolyomino(createGrid(2, 2), mono, { row: 0, col: 1 });
    expect(placed.cells[0][1].polyominoId).toBe('monomino');
    const after = removePolyomino(placed, 'monomino');
    expect(after.cells[0][1]).toEqual({ occupied: false });
    expect('polyominoId' in after.cells[0][1]).toBe(false);
  });
});
