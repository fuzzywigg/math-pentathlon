/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball initial opener identity.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';

describe('Wave 56 pinball types — initial opener', () => {
  it('opener seats/round/nulls/zeros leftover', () => {
    const state = createInitialState();
    expect(state.currentPlayer).toBe('player1');
    expect(state.roundNumber).toBe(1);
    expect(state.winner).toBeNull();
    expect(state.selectedAnswer).toBeNull();
    expect(state.isCorrect).toBeNull();
    expect(state.player1Stats.score).toBe(0);
    expect(state.player2Stats.correctAnswers).toBe(0);
    expect(state.player2Stats.wrongAnswers).toBe(0);
  });
});
