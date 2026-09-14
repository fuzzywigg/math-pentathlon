/**
 * Wave 44 — Fab-a-Diffy createInitialState shape / types helpers leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import {
  createBarId,
  createAnswerId,
  getOpponent,
  FRACTION_BAR_VALUES,
  ANSWER_BAR_VALUES,
  CONFIG,
} from '../../src/games/fab-a-diffy/types';

describe('Wave 44 Fab — initial state + type helpers', () => {
  it('createInitialState sizes match catalogs', () => {
    const state = createInitialState();
    expect(state.fractionBars.size).toBe(FRACTION_BAR_VALUES.length);
    expect(state.answerBars.size).toBe(ANSWER_BAR_VALUES.length);
    expect(state.phase).toBe('selectingBar1');
    expect(state.currentPlayer).toBe('player1');
    expect(state.selectedBar1).toBeNull();
    expect(state.selectedBar2).toBeNull();
    expect(state.selectedOperation).toBeNull();
    expect(state.winner).toBeNull();
    expect(state.moveHistory).toEqual([]);
    expect(state.scores).toEqual({ player1: 0, player2: 0 });
  });

  it('bar/answer ids and getOpponent helpers', () => {
    expect(createBarId(0)).toBe('bar-0');
    expect(createBarId(12)).toBe('bar-12');
    expect(createAnswerId(3)).toBe('answer-3');
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });

  it('CONFIG.TOTAL_ROUNDS is positive; answers start unclaimed', () => {
    expect(CONFIG.TOTAL_ROUNDS).toBeGreaterThan(0);
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
