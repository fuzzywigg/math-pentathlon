/**
 * Wave 42 — Frac-Fact submitAnswer outside playing identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame, submitAnswer } from '../../src/games/frac-fact/rules';

describe('Wave 42 frac-fact — submit phase', () => {
  it('no problem / showingResult submit identity', () => {
    const open = createInitialState('easy');
    expect(submitAnswer(open, { numerator: 1, denominator: 1 })).toBe(open);
    let s = startGame(open);
    s = submitAnswer(s, s.currentProblem!.correctAnswer);
    expect(s.phase).toBe('showingResult');
    expect(submitAnswer(s, s.currentProblem!.correctAnswer)).toBe(s);
  });
});
