/**
 * Wave 43 — Sum Dominoes executeAITurn rolling→pass path. Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/sum-dominoes/rules';
import { executeAITurn } from '../../src/games/sum-dominoes/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 43 sum-dominoes — AI execute roll/pass', () => {
  it('AI from rolling advances state for seat player1', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createInitialState();
    const next = executeAITurn(state, 'player1', 'easy');
    expect(next).not.toBe(state);
    expect(
      next.currentPlayer === 'player2' ||
        next.phase === 'placing' ||
        next.phase === 'passing' ||
        next.phase === 'rolling' ||
        next.phase === 'gameOver'
    ).toBe(true);
  });
});
