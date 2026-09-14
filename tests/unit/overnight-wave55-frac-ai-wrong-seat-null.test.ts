/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact getAIAnswer wrong seat null.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getAIAnswer } from '../../src/games/frac-fact/ai';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame } from '../../src/games/frac-fact/rules';

describe('Wave 55 frac AI — wrong seat', () => {
  it('returns null when currentPlayer is not the AI seat', () => {
    const state = startGame(createInitialState('easy'));
    expect(state.currentPlayer).toBe('player1');
    expect(getAIAnswer(state, 'player2', 'hard')).toBeNull();
  });
});
