/**
 * Wave 43 TOKENMAXX — Fab-a-Diffy opening invariants. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { FRACTION_BAR_VALUES, ANSWER_BAR_VALUES } from '../../src/games/fab-a-diffy/types';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 fab — initial state', () => {
  it('opens selectingBar1 with matching bar/answer counts', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    expect(state.phase).toBe('selectingBar1');
    expect(state.currentPlayer).toBe('player1');
    expect(state.winner).toBeNull();
    expect(state.selectedBar1).toBeNull();
    expect(state.selectedBar2).toBeNull();
    expect(state.selectedOperation).toBeNull();
    expect(state.moveHistory).toEqual([]);
    expect(state.scores).toEqual({ player1: 0, player2: 0 });
    expect(state.fractionBars.size).toBe(FRACTION_BAR_VALUES.length);
    expect(state.answerBars.size).toBe(ANSWER_BAR_VALUES.length);
    for (const bar of state.fractionBars.values()) {
      expect(bar.used).toBe(false);
      expect(bar.owner).toBeNull();
    }
    for (const ans of state.answerBars.values()) {
      expect(ans.claimedBy).toBeNull();
    }
  });
});
