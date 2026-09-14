/**
 * Overnight TOKENMAXX HEAVY — getAllPossibleSums/Products singleton + dup values leftover.
 * After #214/#215. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getAllPossibleSums,
  getAllPossibleProducts,
} from '../../src/core/dice/roller';

describe('Overnight dice — subset singleton and duplicate collapse', () => {
  it('singleton sums/products equal the value', () => {
    expect(getAllPossibleSums([7])).toEqual([7]);
    expect(getAllPossibleProducts([7])).toEqual([7]);
  });

  it('duplicate values collapse set membership', () => {
    expect(getAllPossibleSums([2, 2])).toEqual([2, 4]);
    expect(getAllPossibleProducts([2, 2])).toEqual([2, 4]);
    expect(getAllPossibleSums([0, 0])).toEqual([0]);
    expect(getAllPossibleProducts([0, 5])).toEqual([0, 5]);
  });
});
