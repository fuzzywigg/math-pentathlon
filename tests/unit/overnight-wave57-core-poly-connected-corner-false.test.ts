/**
 * Overnight HEAVY leftover after #264 — areCellsConnected rejects diagonal-only.
 * Distinct from wave52 adjacent corner OOB. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { areCellsConnected, isAdjacent } from '../../src/core/polyomino';

describe('Wave 57 core poly — connected corner', () => {
  it('diagonal pair is not 4-way connected', () => {
    const a = { row: 0, col: 0 };
    const b = { row: 1, col: 1 };
    expect(isAdjacent(a, [b])).toBe(false);
    expect(areCellsConnected([a, b])).toBe(false);
    expect(
      areCellsConnected([
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ])
    ).toBe(true);
  });
});
