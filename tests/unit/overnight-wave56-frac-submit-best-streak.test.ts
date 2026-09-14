/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Frac Fact bestStreak ladder leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame, submitAnswer } from '../../src/games/frac-fact/rules';

describe('Wave 56 frac rules — bestStreak ladder', () => {
  it('correct answers raise bestStreak and score leftover', () => {
    let state = startGame(createInitialState('easy'));
    const first = state.currentProblem!;
    state = submitAnswer(state, first.correctAnswer);
    expect(state.player1Stats.currentStreak).toBe(1);
    expect(state.player1Stats.bestStreak).toBe(1);
    expect(state.player1Stats.score).toBe(10);
    expect(state.phase).toBe('showingResult');
  });
});
