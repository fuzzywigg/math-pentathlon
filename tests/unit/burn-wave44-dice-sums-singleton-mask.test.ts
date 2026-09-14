/**
 * Wave 44 — getAllPossibleSums singleton / mask leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAllPossibleSums } from '../../src/core/dice';

describe('Wave 44 dice — subset sums singleton', () => {
  it('singleton yields that value only', () => {
    expect(getAllPossibleSums([9])).toEqual([9]);
  });

  it('duplicates still produce unique sorted sums', () => {
    expect(getAllPossibleSums([2, 2, 3])).toEqual([2, 3, 4, 5, 7]);
  });
});
