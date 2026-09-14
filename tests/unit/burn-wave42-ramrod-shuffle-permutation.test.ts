/**
 * Wave 42 leftovers D — ramrod shuffle permutation. Tests-only. No product inventing.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { shuffleArray } from '../../src/games/ramrod/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 ramrod — shuffle permutation', () => {
  it('spy Math.random deterministic; same elements and length', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const input = [1, 2, 3, 4, 5, 6];
    const copy = [...input];
    const shuffled = shuffleArray(input);

    expect(input).toEqual(copy); // does not mutate input
    expect(shuffled).toHaveLength(input.length);
    expect([...shuffled].sort((a, b) => a - b)).toEqual(input);
    expect(shuffled).not.toBe(input);

    const again = shuffleArray(input);
    expect(again).toEqual(shuffled);
  });
});
