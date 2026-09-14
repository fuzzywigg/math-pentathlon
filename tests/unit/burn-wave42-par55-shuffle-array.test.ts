/**
 * Wave 42 — Par 55 shuffleArray copy/mutation leftovers after #186. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { shuffleArray, createBlockSet } from '../../src/games/par-55/types';

describe('Wave 42 par55 — shuffleArray', () => {
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

  it('can reorder when random varies (not identity shuffle)', () => {
    let call = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      call++;
      return call % 2 === 0 ? 0.99 : 0.01;
    });
    const input = ['a', 'b', 'c', 'd', 'e'];
    const result = shuffleArray(input);
    expect(result.sort()).toEqual(input.sort());
    expect(result).not.toEqual(input);
  });

  it('handles empty and single-element arrays', () => {
    expect(shuffleArray([])).toEqual([]);
    expect(shuffleArray([42])).toEqual([42]);
  });
});
