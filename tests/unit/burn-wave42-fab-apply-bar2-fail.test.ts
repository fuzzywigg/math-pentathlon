/**
 * Wave 42 leftovers B — Fab applyAIMoveSteps bogus bar2 after valid bar1.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

import { applyAIMoveSteps, getAIMove, type AIMove } from '../../src/games/fab-a-diffy/ai';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Wave 42 fab — applyAIMoveSteps bar2 fail', () => {
  it('valid bar1 + bogus bar2 falls back to passTurn', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const state = createInitialState();
    const good = getAIMove(state, 'player1', 'hard');
    expect(good).not.toBeNull();
    const bad: AIMove = { ...good!, bar2Id: 'not-a-real-bar' };
    const next = applyAIMoveSteps(state, bad);
    expect(next.currentPlayer).toBe('player2');
    expect(next.phase).toBe('selectingBar1');
  });
});
