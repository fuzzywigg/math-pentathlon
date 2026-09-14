/**
 * Overnight TOKENMAXX HEAVY leftovers after #260 — Pinball submitAnswer phase identity gate.
 * Distinct from miss/hit scoring leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame, submitAnswer } from '../../src/games/fraction-pinball/rules';

describe('Wave 57 pinball rules — submit phase gate', () => {
  it('returns same state when phase is showResult leftover', () => {
    const started = startGame(createInitialState());
    const answered = submitAnswer(
      started,
      started.currentChallenge!.correctAnswer
    );
    expect(answered.phase).toBe('showResult');
    const again = submitAnswer(answered, '0.5');
    expect(again).toBe(answered);
  });
});
