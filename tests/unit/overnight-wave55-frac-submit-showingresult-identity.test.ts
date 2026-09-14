/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Frac Fact submitAnswer showingResult identity.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame, submitAnswer } from '../../src/games/frac-fact/rules';

describe('Wave 55 frac rules — submit showingResult identity', () => {
  it('returns same object when phase is already showingResult', () => {
    const started = startGame(createInitialState('easy'));
    const showing = submitAnswer(started, started.currentProblem!.correctAnswer);
    expect(showing.phase).toBe('showingResult');
    const again = submitAnswer(showing, started.currentProblem!.answerChoices[0]);
    expect(again).toBe(showing);
  });
});
