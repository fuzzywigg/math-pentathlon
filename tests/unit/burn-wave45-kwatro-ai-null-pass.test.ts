/**
 * Wave 45 — Kwatro AI null/pass leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/kwatro-sinko/rules';
import { getAIMove, executeAITurn } from '../../src/games/kwatro-sinko/ai';

describe('Wave 45 kwatro — AI null pass', () => {
  it('null on gameOver/wrong seat; execute wrong seat passes', () => {
    const state = createInitialState();
    expect(getAIMove({ ...state, phase: 'gameOver' }, 'player1', 'hard')).toBeNull();
    expect(getAIMove(state, 'player2', 'hard')).toBeNull();
    const next = executeAITurn(state, 'player2', 'hard');
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(0);
  });
});
