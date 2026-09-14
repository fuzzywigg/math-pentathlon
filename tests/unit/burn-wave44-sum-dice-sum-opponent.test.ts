/**
 * Wave 44 — Sum Dominoes dice sum / opponent leftovers.
 * Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { getDiceSum, getOpponent, rollDice } from '../../src/games/sum-dominoes/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 Sum Dominoes — dice sum / opponent', () => {
  it('sums dice and flips seats; roll bounds', () => {
    expect(getDiceSum([2, 5])).toBe(7);
    expect(getOpponent('player1')).toBe('player2');
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(rollDice()).toEqual([1, 1]);
  });
});
