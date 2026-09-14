/**
 * Wave 44 — Contig board uniqueness leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { BOARD_NUMBERS, createBoard } from '../../src/games/contig-60/types';

describe('Wave 44 Contig — board unique values', () => {
  it('createBoard maps all 60 distinct values', () => {
    const { cells, grid } = createBoard();
    expect(cells.size).toBe(60);
    expect(grid.flat().filter((v) => v !== null)).toHaveLength(60);
    const flat = BOARD_NUMBERS.flat();
    expect(new Set(flat).size).toBe(flat.length);
  });
});
