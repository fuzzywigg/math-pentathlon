/**
 * Wave 56 leftover after #256 — Juggle getCategoryName exact cell labels.
 * Complements overnight length-only matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getCategoryName, ShapeCategory } from '../../src/games/juggle/types';

describe('Wave 56 juggle — category name exact', () => {
  it('maps each category to its display cell count string', () => {
    const expected: Record<ShapeCategory, string> = {
      monomino: 'Monomino (1 cell)',
      domino: 'Domino (2 cells)',
      tromino: 'Tromino (3 cells)',
      tetromino: 'Tetromino (4 cells)',
      pentomino: 'Pentomino (5 cells)',
    };
    (Object.keys(expected) as ShapeCategory[]).forEach((cat) => {
      expect(getCategoryName(cat)).toBe(expected[cat]);
    });
  });
});
