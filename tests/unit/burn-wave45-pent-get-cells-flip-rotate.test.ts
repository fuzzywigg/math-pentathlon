/**
 * Wave 45 — Pent getPieceCells flip-then-rotate leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getPieceCells } from '../../src/games/pent-em-in/rules';

describe('Wave 45 pent — getPieceCells', () => {
  it('unknown shape returns empty; F flip+90 yields 5 in-bounds cells', () => {
    expect(getPieceCells('nope', { row: 0, col: 0 }, 0, false)).toEqual([]);
    const cells = getPieceCells('F', { row: 3, col: 3 }, 90, true);
    expect(cells).toHaveLength(5);
  });

  it('X at origin occupies 5 cells', () => {
    expect(getPieceCells('X', { row: 0, col: 0 }, 0, false)).toHaveLength(5);
  });
});
