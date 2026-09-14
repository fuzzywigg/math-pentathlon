/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball submitAnswer showResult identity.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame, submitAnswer } from '../../src/games/fraction-pinball/rules';

describe('Wave 55 pinball rules — submit showResult identity', () => {
  it('returns same object when phase is already showResult', () => {
    const started = startGame(createInitialState());
    const showing = submitAnswer(started, started.currentChallenge!.correctAnswer);
    expect(showing.phase).toBe('showResult');
    const again = submitAnswer(showing, '0.5');
    expect(again).toBe(showing);
  });
});
