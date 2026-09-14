/**
 * Wave 43 — selectDie index 1 leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, doRollDice, selectDie } from '../../src/games/juggle/rules';
import { getCategoryFromDie } from '../../src/games/juggle/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 juggle — select die index1', () => {
  it('die index 1 drives category from second face', () => {
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.0) // die0 -> 1
      .mockReturnValueOnce(0.5); // die1 -> 4
    let s = doRollDice(createInitialState());
    expect(s.currentDice).toEqual([1, 4]);
    s = selectDie(s, 1);
    expect(s.selectedCategory).toBe(getCategoryFromDie(4));
  });
});
