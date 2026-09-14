/**
 * Wave 42 — Fab-a-Diffy createInitialState bar maps leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import {
  FRACTION_BAR_VALUES,
  ANSWER_BAR_VALUES,
} from '../../src/games/fab-a-diffy/types';

describe('Wave 42 fab — createInitialState maps', () => {
  it('fraction and answer maps are nonempty matching catalogs', () => {
    const state = createInitialState();
    expect(state.fractionBars.size).toBe(FRACTION_BAR_VALUES.length);
    expect(state.answerBars.size).toBe(ANSWER_BAR_VALUES.length);
    expect(state.fractionBars.size).toBeGreaterThan(0);
    expect(state.answerBars.size).toBeGreaterThan(0);
  });

  it('opens selectingBar1 for player1 with cleared selection', () => {
    const state = createInitialState();
    expect(state.phase).toBe('selectingBar1');
    expect(state.currentPlayer).toBe('player1');
    expect(state.selectedBar1).toBeNull();
    expect(state.selectedBar2).toBeNull();
    expect(state.selectedOperation).toBeNull();
    expect(state.winner).toBeNull();
    expect(state.scores).toEqual({ player1: 0, player2: 0 });
  });

  it('all bars unused and answers unclaimed', () => {
    const state = createInitialState();
    for (const bar of state.fractionBars.values()) {
      expect(bar.used).toBe(false);
      expect(bar.owner).toBeNull();
    }
    for (const ans of state.answerBars.values()) {
      expect(ans.claimedBy).toBeNull();
    }
  });
});
