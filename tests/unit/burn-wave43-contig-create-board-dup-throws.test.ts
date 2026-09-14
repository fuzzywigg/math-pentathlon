/**
 * Wave 43 — Contig createBoard duplicate numbers throw leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createBoard } from '../../src/games/contig-60/types';

describe('Wave 43 contig — createBoard duplicates', () => {
  it('throws when board numbers are not unique', () => {
    const bad = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15, 16, 18, 20, 21, 24],
      [25, 27, 28, 30, 32, 35, 36, 40, 42, 45],
      [48, 50, 54, 55, 60, 64, 66, 72, 75, 80],
      [84, 90, 96, 100, 108, 120, 125, 144, 150, 180],
      [17, 19, 22, 23, 26, 29, 31, 33, 34, 1], // dup 1
    ];
    expect(() => createBoard(bad)).toThrow();
  });
});
