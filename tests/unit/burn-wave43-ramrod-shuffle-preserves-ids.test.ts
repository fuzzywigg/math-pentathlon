/**
 * Wave 43 — shuffleArray preserves multiset leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { shuffleArray } from '../../src/games/ramrod/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 ramrod — shuffle preserves ids', () => {
  it('shuffleArray keeps same multiset', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.3);
    const input = ['a', 'b', 'c', 'd', 'e'];
    const out = shuffleArray(input);
    expect([...out].sort()).toEqual([...input].sort());
    expect(out).not.toBe(input);
  });
});
