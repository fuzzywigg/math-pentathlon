/**
 * Wave 43 TOKENMAXX — Fab AI execute / difficulties leftovers. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { getAIMove, executeAITurn } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 fab — AI execute difficulties', () => {
  it('medium/hard/easy return a legal move on opening', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    for (const d of ['easy', 'medium', 'hard'] as const) {
      const move = getAIMove(state, 'player1', d);
      expect(move).not.toBeNull();
      expect(state.fractionBars.has(move!.bar1Id)).toBe(true);
      expect(state.fractionBars.has(move!.bar2Id)).toBe(true);
      expect(state.answerBars.has(move!.answerId)).toBe(true);
    }
  });

  it('executeAITurn claims an answer and advances', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createInitialState();
    const next = executeAITurn(state, 'player1', 'hard');
    expect(next.moveHistory.length).toBe(1);
    expect(next.scores.player1).toBe(1);
    expect(next.currentPlayer).toBe('player2');
  });
});
