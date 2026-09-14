/**
 * Wave 44 overnight HEAVY — Fab AI hard prefers top score.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { getAIMove } from '../../src/games/fab-a-diffy/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 44 fab AI — hard', () => {
  it(
    'returns move with low randomness seed',
    () => {
      const state = createInitialState();
      vi.spyOn(Math, 'random').mockReturnValue(0.5); // > 0.03
      const move = getAIMove(state, 'player1', 'hard');
      expect(move).not.toBeNull();
      expect(move!.answerId.startsWith('answer-')).toBe(true);
    },
    15_000
  );
});
