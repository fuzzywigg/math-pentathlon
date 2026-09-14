/**
 * Wave 43 TOKENMAXX — Fab AI execute / difficulties leftovers. Tests-only.
 * Hardened timeout: findAllValidMoves on full opening is ~0.6–2s/call under CI load.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { getAIMove, executeAITurn } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 fab — AI execute difficulties', () => {
  it.each(['easy', 'medium', 'hard'] as const)(
    '%s returns a legal move on opening',
    (d) => {
      // Create before spy so shuffle is not pinned; pin RNG only for AI pick.
      const state = createInitialState();
      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      const move = getAIMove(state, 'player1', d);
      expect(move).not.toBeNull();
      expect(state.fractionBars.has(move!.bar1Id)).toBe(true);
      expect(state.fractionBars.has(move!.bar2Id)).toBe(true);
      expect(state.answerBars.has(move!.answerId)).toBe(true);
    },
    15_000
  );

  it(
    'executeAITurn claims an answer and advances',
    () => {
      const state = createInitialState();
      vi.spyOn(Math, 'random').mockReturnValue(0.99);
      const next = executeAITurn(state, 'player1', 'hard');
      expect(next.moveHistory.length).toBe(1);
      expect(next.scores.player1).toBe(1);
      expect(next.currentPlayer).toBe('player2');
    },
    15_000
  );
});
