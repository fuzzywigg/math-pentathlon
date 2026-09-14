/**
 * Wave 44 overnight HEAVY — Fab shuffleArray preserves membership.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { shuffleArray } from '../../src/games/fab-a-diffy/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 fab types — shuffle', () => {
  it('preserves length and membership', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const src = [1, 2, 3, 4, 5];
    const out = shuffleArray(src);
    expect(out).not.toBe(src);
    expect(out.sort()).toEqual([1, 2, 3, 4, 5]);
    expect(src).toEqual([1, 2, 3, 4, 5]);
  });

  it('empty and singleton identity', () => {
    expect(shuffleArray([])).toEqual([]);
    expect(shuffleArray(['only'])).toEqual(['only']);
  });
});
