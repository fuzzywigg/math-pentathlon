/**
 * Wave 48 — Juggle hard vs easy holes consideration (random=0). Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState, doRollDice, selectDie, selectShape } from '../../src/games/juggle/rules';
import { getAIPlacement } from '../../src/games/juggle/ai';
import { getShapesForDie } from '../../src/games/juggle/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 48 juggle — holes hard vs easy', () => {
  it('hard and easy both return a placement with random=0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    let state = doRollDice(createInitialState());
    state = selectDie(state, 0);
    if (state.phase !== 'placing') {
      state = selectShape(state, getShapesForDie(state.currentDice![0])[0]);
    }
    const hard = getAIPlacement(state, 'player1', 'hard');
    const easy = getAIPlacement(state, 'player1', 'easy');
    expect(hard).not.toBeNull();
    expect(easy).not.toBeNull();
    expect(hard!.position).toBeDefined();
    expect(easy!.position).toBeDefined();
  });
});
