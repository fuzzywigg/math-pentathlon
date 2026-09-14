/**
 * Wave 48 overnight — Juggle getAIDieChoice null when category set. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, doRollDice, selectDie } from '../../src/games/juggle/rules';
import { getAIDieChoice } from '../../src/games/juggle/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle overnight — AI die already selected', () => {
  it('returns null once selectedCategory is set', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = doRollDice(createInitialState());
    state = selectDie(state, 0);
    expect(state.selectedCategory).not.toBeNull();
    expect(getAIDieChoice(state, 'player1', 'hard')).toBeNull();
  });
});
