/**
 * Overnight HEAVY leftover after #280 — rotateCells90CW matches rotate 90.
 * Distinct from wave58 rotatePolyomino shape wrapper. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  rotateCells90CW,
  rotateCells,
  normalizeCells,
  cellsToKey,
  SIMPLE_SHAPES,
} from '../../src/core/polyomino';

describe('Wave 59 core poly — rotate cells 90cw', () => {
  it('90CW helper keys equal rotateCells(..., 90) after normalize', () => {
    const domino = SIMPLE_SHAPES.find((s) => s.id === 'domino')!;
    const viaHelper = cellsToKey(normalizeCells(rotateCells90CW(domino.cells)));
    const viaRotate = cellsToKey(normalizeCells(rotateCells(domino.cells, 90)));
    expect(viaHelper).toBe(viaRotate);
  });
});
