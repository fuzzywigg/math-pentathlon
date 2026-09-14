/**
 * Overnight HEAVY leftover after #234 — flipPolyomino always flips; getTransformedCells honors canFlip.
 * Distinct from burn-wave38-poly-flip-empty-cells. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  flipPolyomino,
  getTransformedCells,
  cellsToKey,
  TETROMINOES,
} from '../../src/core/polyomino';

describe('Wave 52 core poly — flipPolyomino ignores flag', () => {
  it('L canFlip false: flipPolyomino changes cells; getTransformedCells(flipped) does not', () => {
    const L = TETROMINOES.find((s) => s.id === 'L')!;
    expect(L.canFlip).toBe(false);
    const flipped = flipPolyomino(L);
    expect(cellsToKey(flipped.cells)).not.toBe(cellsToKey(L.cells));
    expect(cellsToKey(getTransformedCells(L, 0, true))).toBe(cellsToKey(L.cells));
  });
});
