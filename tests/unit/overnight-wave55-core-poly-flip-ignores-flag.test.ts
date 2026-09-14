/**
 * Overnight HEAVY leftover after #250 — flipPolyomino ignores canFlip; getTransformedCells
 * respects it. Distinct from wave52 getAbsoluteCells vs getCellsAtPosition. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  flipPolyomino,
  getTransformedCells,
  cellsToKey,
  TETROMINOES,
} from '../../src/core/polyomino';

describe('Wave 55 core poly — flipPolyomino ignores canFlip', () => {
  it('J tetromino canFlip false still mirrors via flipPolyomino', () => {
    const J = TETROMINOES.find((s) => s.id === 'J')!;
    expect(J.canFlip).toBe(false);
    const flagged = getTransformedCells(J, 0, true);
    expect(cellsToKey(flagged)).toBe(cellsToKey(J.cells));
    const forced = flipPolyomino(J);
    expect(cellsToKey(forced.cells)).not.toBe(cellsToKey(J.cells));
  });
});
