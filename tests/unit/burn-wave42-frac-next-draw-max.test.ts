/**
 * Wave 42 — Frac-Fact nextProblem max → draw/win settle. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import {
  startGame,
  submitAnswer,
  nextProblem,
} from '../../src/games/frac-fact/rules';

describe('Wave 42 frac-fact — max settle', () => {
  it('completing maxProblems settles winner by score', () => {
    let s = startGame({ ...createInitialState('easy'), maxProblems: 1 });
    s = submitAnswer(s, s.currentProblem!.correctAnswer);
    s = nextProblem(s);
    expect(s.phase).toBe('gameOver');
    expect(s.winner).toBe('player1');
    expect(s.currentProblem).toBeNull();
  });

  it('tie scores → null winner', () => {
    let s = startGame({ ...createInitialState('easy'), maxProblems: 1 });
    s = submitAnswer(s, s.currentProblem!.correctAnswer);
    s = {
      ...s,
      player1Stats: { ...s.player1Stats, score: 10 },
      player2Stats: { ...s.player2Stats, score: 10 },
    };
    s = nextProblem(s);
    expect(s.phase).toBe('gameOver');
    expect(s.winner).toBeNull();
  });
});
