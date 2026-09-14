/**
 * Wave 47 leftover after #214/#215 — Par 55 shuffleArray copy/mutation leftovers after #186. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { shuffleArray, createBlockSet } from '../../src/games/par-55/types';

describe('Wave 47 par deepen 15 — Wave 47 par55 — shuffleArray', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a new array without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    const result = shuffleArray(input);
    expect(result).not.toBe(input);
    expect(input).toEqual(copy);
  });

  it('preserves length and multiset of elements', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const blocks = createBlockSet();
    const shuffled = shuffleArray(blocks);
    expect(shuffled).toHaveLength(blocks.length);
    expect(shuffled).toHaveLength(60);

    const sortById = (arr: { id: string }[]) =>
      [...arr].sort((a, b) => a.id.localeCompare(b.id));
    expect(sortById(shuffled)).toEqual(sortById(blocks));
  });

  it('invokes Math.random once per Fisher-Yates iteration (n-1 times)', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0);
    const input = ['a', 'b', 'c', 'd', 'e'];
    const result = shuffleArray(input);
    expect(randomSpy).toHaveBeenCalledTimes(input.length - 1);
    expect(result).toHaveLength(input.length);
    expect(result.sort()).toEqual(input.sort());
    expect(input).toEqual(['a', 'b', 'c', 'd', 'e']);
  });

  it('handles empty and single-element arrays', () => {
    expect(shuffleArray([])).toEqual([]);
    expect(shuffleArray([42])).toEqual([42]);
  });
});
