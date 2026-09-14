/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Frac Fact submitAnswer phase identity gate.
 * Distinct from streak/bestStreak leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame, submitAnswer } from '../../src/games/frac-fact/rules';

describe('Wave 57 frac rules — submit phase gate', () => {
  it('returns same state when phase is showingResult leftover', () => {
    const started = startGame(createInitialState('easy'));
    const answered = submitAnswer(
      started,
      started.currentProblem!.correctAnswer
    );
    expect(answered.phase).toBe('showingResult');
    const again = submitAnswer(answered, { numerator: 1, denominator: 1 });
    expect(again).toBe(answered);
  });
});
