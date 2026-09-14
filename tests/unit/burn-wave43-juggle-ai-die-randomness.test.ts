/**
 * Wave 43 — getAIDieChoice randomness leftover. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, doRollDice } from '../../src/games/juggle/rules';
import { getAIDieChoice } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 juggle — AI die randomness', () => {
  it('easy die choice returns index 0 or 1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const s = doRollDice(createInitialState());
    const choice = getAIDieChoice(s, 'player1', 'easy');
    expect(choice).not.toBeNull();
    expect([0, 1]).toContain(choice!.index);
  });
});
