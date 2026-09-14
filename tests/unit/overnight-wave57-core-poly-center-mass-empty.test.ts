/**
 * Overnight HEAVY leftover after #264 — getCenterOfMass empty → origin.
 * Distinct from burn-wave empty COM overnight naming. Tests-only deepen.
 */
import { describe, it, expect } from 'vitest';
import { getCenterOfMass, centerCells, canonicalizeCells } from '../../src/core/polyomino';

describe('Wave 57 core poly — center mass empty', () => {
  it('empty COM is origin; centered tromino COM near zero', () => {
    expect(getCenterOfMass([])).toEqual({ row: 0, col: 0 });
    const centered = centerCells([
      { row: 2, col: 5 },
      { row: 2, col: 6 },
      { row: 2, col: 7 },
    ]);
    const com = getCenterOfMass(centered);
    expect(Math.abs(com.row)).toBeLessThan(1);
    expect(Math.abs(com.col)).toBeLessThan(1);
    expect(canonicalizeCells(centered)[0]).toEqual({ row: 0, col: 0 });
  });
});
