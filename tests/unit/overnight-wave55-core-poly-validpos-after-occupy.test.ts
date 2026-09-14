/**
 * Overnight HEAVY leftover after #250 — getAllValidPositions shrinks after occupy.
 * Distinct from wave40 poly-grid-remove-validpos. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createGrid,
  placePolyomino,
  getAllValidPositions,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 55 core poly — valid positions after occupy', () => {
  it('domino on 2×3 has two anchors empty and one after a block', () => {
    const d = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    const empty = getAllValidPositions(createGrid(2, 3), d, 0, false);
    expect(empty.length).toBeGreaterThan(1);
    const blocked = placePolyomino(createGrid(2, 3), d, { row: 0, col: 0 });
    const left = getAllValidPositions(blocked, d, 0, false);
    expect(left.length).toBeLessThan(empty.length);
    expect(left.every((p) => !(p.row === 0 && p.col === 0))).toBe(true);
  });
});
