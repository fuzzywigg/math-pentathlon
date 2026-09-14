/**
 * Wave 45 — Par 55 shuffleArray empty/singleton leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { shuffleArray } from '../../src/games/par-55/types';

describe('Wave 45 par — shuffle edges', () => {
  it('empty and singleton are identity-length permutations', () => {
    expect(shuffleArray([])).toEqual([]);
    expect(shuffleArray([7])).toEqual([7]);
  });
});
