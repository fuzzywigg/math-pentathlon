/** Wave 42 — Frac Fact tie null winner and player1 win settle. Tests-only. */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { nextProblem } from '../../src/games/frac-fact/rules';

function nearEnd(scores: { p1: number; p2: number }) {
  return {
    ...createInitialState('easy'),
    phase: 'showingResult' as const,
    problemsCompleted: 9,
    maxProblems: 10,
    player1Stats: {
      ...createInitialState().player1Stats,
      score: scores.p1,
    },
    player2Stats: {
      ...createInitialState().player2Stats,
      score: scores.p2,
    },
  };
}

describe('Wave 42 Frac Fact — tie and p1 win settle', () => {
  it('equal scores yield winner null (draw)', () => {
    const next = nextProblem(nearEnd({ p1: 40, p2: 40 }));
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
    expect(next.problemsCompleted).toBe(10);
  });

  it('player1 higher score wins', () => {
    const next = nextProblem(nearEnd({ p1: 55, p2: 20 }));
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('player2 higher score wins (contrast)', () => {
    const next = nextProblem(nearEnd({ p1: 5, p2: 50 }));
    expect(next.winner).toBe('player2');
  });

  it('settle clears problem and selection fields', () => {
    const state = {
      ...nearEnd({ p1: 1, p2: 1 }),
      currentProblem: {
        id: 'problem-10',
        operand1: { numerator: 1, denominator: 2 },
        operand2: { numerator: 1, denominator: 3 },
        operation: 'add' as const,
        correctAnswer: { numerator: 5, denominator: 6 },
        answerChoices: [
          { numerator: 5, denominator: 6 },
          { numerator: 1, denominator: 2 },
          { numerator: 2, denominator: 3 },
          { numerator: 1, denominator: 1 },
        ],
      },
      selectedAnswer: { numerator: 5, denominator: 6 },
      isCorrect: true,
    };
    const next = nextProblem(state);
    expect(next.currentProblem).toBeNull();
    expect(next.selectedAnswer).toBeNull();
    expect(next.isCorrect).toBeNull();
  });

  it('zero-zero tie is still a draw', () => {
    const next = nextProblem(nearEnd({ p1: 0, p2: 0 }));
    expect(next.winner).toBeNull();
    expect(next.phase).toBe('gameOver');
  });
});
