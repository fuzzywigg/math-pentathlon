/**
 * Wave 44 — Sum Dominoes shuffleArray leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { shuffleArray } from '../../src/games/sum-dominoes/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 Sum Dominoes — shuffle permutation', () => {
  it('preserves membership; deterministic with fixed random', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const src = [1, 2, 3, 4, 5];
    const out = shuffleArray(src);
    expect(out.sort()).toEqual([1, 2, 3, 4, 5]);
    expect(src).toEqual([1, 2, 3, 4, 5]);
  });
});
