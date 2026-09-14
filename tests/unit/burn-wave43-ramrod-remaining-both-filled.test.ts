/**
 * Wave 43 — getRemainingValue when both filled leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createRod, type SumBox } from '../../src/games/ramrod/types';
import { getRemainingValue, getBoxSum } from '../../src/games/ramrod/rules';

describe('Wave 43 ramrod — remaining both filled', () => {
  it('both rods present → getRemainingValue returns targetSum; getBoxSum works', () => {
    const box: SumBox = {
      id: 'box-0-0',
      targetSum: 9,
      row: 0,
      col: 0,
      rods: [createRod('a', 4), createRod('b', 5)],
      completedBy: 'player1',
    };
    expect(getRemainingValue(box)).toBe(9);
    expect(getBoxSum(box)).toBe(9);
  });
});
