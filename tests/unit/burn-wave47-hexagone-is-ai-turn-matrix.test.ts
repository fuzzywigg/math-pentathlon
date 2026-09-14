/**
 * Wave 47 leftover after #214/#215 leftovers D — Hex-a-Gone isAITurn matrix. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { isAITurn } from '../../src/games/hex-a-gone/ai';

describe('Wave 47 hex-a-gone deepen 15 — D hexagone — isAITurn matrix', () => {
  it('false for human-vs-human, null AI, gameOver, or wrong seat', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);

    const over = {
      ...state,
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(isAITurn(over, 'player1', 'human-vs-ai')).toBe(false);
  });

  it('true only when human-vs-ai and currentPlayer matches aiPlayer', () => {
    const state = createInitialState();
    expect(isAITurn(state, 'player1', 'human-vs-ai')).toBe(true);
    const p2 = { ...state, currentPlayer: 'player2' as const };
    expect(isAITurn(p2, 'player2', 'human-vs-ai')).toBe(true);
  });
});
