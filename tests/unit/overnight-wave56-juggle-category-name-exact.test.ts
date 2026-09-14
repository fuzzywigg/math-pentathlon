/**
 * Wave 56 leftover after #256 — Juggle getCategoryName exact map.
 * Distinct from wave42/43 nonempty / contains "(" checks. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getCategoryName } from '../../src/games/juggle/types';

describe('Wave 56 juggle — category name exact', () => {
  it('maps every category to the display label catalog', () => {
    expect(getCategoryName('monomino')).toBe('Monomino (1 cell)');
    expect(getCategoryName('domino')).toBe('Domino (2 cells)');
    expect(getCategoryName('tromino')).toBe('Tromino (3 cells)');
    expect(getCategoryName('tetromino')).toBe('Tetromino (4 cells)');
    expect(getCategoryName('pentomino')).toBe('Pentomino (5 cells)');
  });
});
