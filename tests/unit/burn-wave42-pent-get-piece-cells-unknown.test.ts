/**
 * Wave 42 — Pent'Em In getPieceCells unknown shape leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getPieceCells, canPlacePiece } from '../../src/games/pent-em-in/rules';

describe('Wave 42 pent-em-in — getPieceCells unknown', () => {
  it('unknown shape id returns empty array at any transform', () => {
    expect(getPieceCells('ZZZ', { row: 0, col: 0 }, 0, false)).toEqual([]);
    expect(getPieceCells('', { row: 5, col: 5 }, 90, true)).toEqual([]);
    expect(getPieceCells('not-a-pent', { row: 2, col: 3 }, 270, false)).toEqual(
      []
    );
  });

  it('unknown shape yields vacuous canPlacePiece true (zero cells)', () => {
    const state = createInitialState();
    expect(canPlacePiece(state, 'bogus', { row: 0, col: 0 }, 0, false)).toBe(
      true
    );
  });
});
