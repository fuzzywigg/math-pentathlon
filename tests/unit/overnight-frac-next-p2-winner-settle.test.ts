/**
 * Overnight TOKENMAXX — Frac-Fact nextProblem p2 win leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { generateProblem, submitAnswer, nextProblem } from '../../src/games/frac-fact/rules';

describe('Overnight frac-fact — p2 winner settle', () => {
  it('maxProblems with p2 ahead settles winner player2', () => {
    const problem = generateProblem('easy', 1);
    let s = {
      ...createInitialState('easy'),
      maxProblems: 1,
      currentPlayer: 'player2' as const,
      currentProblem: problem,
      phase: 'playing' as const,
      player2Stats: {
        score: 50,
        correctAnswers: 0,
        wrongAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
      },
      player1Stats: {
        score: 10,
        correctAnswers: 0,
        wrongAnswers: 0,
        currentStreak: 0,
        bestStreak: 0,
      },
    };
    s = submitAnswer(s, problem.correctAnswer);
    const done = nextProblem(s);
    expect(done.phase).toBe('gameOver');
    expect(done.winner).toBe('player2');
  });
});
