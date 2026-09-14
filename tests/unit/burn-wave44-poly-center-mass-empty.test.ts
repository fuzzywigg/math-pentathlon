/**
 * Wave 44 — getCenterOfMass / centerCells empty leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getCenterOfMass, centerCells, normalizeCells } from '../../src/core/polyomino';

describe('Wave 44 poly — center of mass', () => {
  it('empty cells → origin mass', () => {
    expect(getCenterOfMass([])).toEqual({ row: 0, col: 0 });
  });

  it('2x2 square mass at 0.5,0.5; centerCells then normalize to origin', () => {
    const cells = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];
    expect(getCenterOfMass(cells)).toEqual({ row: 0.5, col: 0.5 });
    const centered = centerCells(cells);
    expect(normalizeCells(centered)[0]).toEqual({ row: 0, col: 0 });
  });
});
