/**
 * Overnight HEAVY leftover after #280 — areCellsEquivalent across translate.
 * Distinct from wave58 orientations uniqueness. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  areCellsEquivalent,
  translateCells,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 59 core poly — cells equivalent shift', () => {
  it('pure translation preserves cell equivalence', () => {
    const tromino = SIMPLE_SHAPES.find((s) => s.id === 'tromino-I')!;
    const shifted = translateCells(tromino.cells, { row: 4, col: -2 });
    expect(areCellsEquivalent(tromino.cells, shifted)).toBe(true);
  });
});
