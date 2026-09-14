/**
 * Wave 44 — Contig rollDice bounds leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { rollDice } from '../../src/games/contig-60/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 Contig — rollDice bounds', () => {
  it('three dice stay in 1..6', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(rollDice()).toEqual([1, 1, 1]);
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    const hi = rollDice();
    expect(hi.every((d) => d >= 1 && d <= 6)).toBe(true);
  });
});
