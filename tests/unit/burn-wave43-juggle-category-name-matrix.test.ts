/**
 * Wave 43 — getCategoryName matrix leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getCategoryName, type ShapeCategory } from '../../src/games/juggle/types';

describe('Wave 43 juggle — category names', () => {
  it('all five categories have display names', () => {
    const cats: ShapeCategory[] = [
      'monomino',
      'domino',
      'tromino',
      'tetromino',
      'pentomino',
    ];
    for (const c of cats) {
      expect(getCategoryName(c)).toMatch(/cell/i);
    }
  });
});
