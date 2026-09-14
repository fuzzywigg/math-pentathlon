/** Wave 42 — Frac Fact nextProblem ungated from playing phase. Tests-only. */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame, nextProblem } from '../../src/games/frac-fact/rules';

describe('Wave 42 Frac Fact — next from playing ungated', () => {
  it('nextProblem advances while still in playing (no showingResult gate)', () => {
    const state = startGame(createInitialState('easy'));
    expect(state.phase).toBe('playing');
    const next = nextProblem(state);
    expect(next.problemsCompleted).toBe(1);
    expect(next.phase).toBe('playing');
    expect(next.currentPlayer).toBe('player2');
    expect(next.currentProblem).not.toBeNull();
  });

  it('clears selectedAnswer and isCorrect even if never submitted', () => {
    const state = {
      ...startGame(createInitialState('medium')),
      selectedAnswer: { numerator: 1, denominator: 2 },
      isCorrect: true as boolean | null,
    };
    const next = nextProblem(state);
    expect(next.selectedAnswer).toBeNull();
    expect(next.isCorrect).toBeNull();
  });

  it('ungated call still settles gameOver at maxProblems', () => {
    const state = {
      ...startGame(createInitialState('easy')),
      phase: 'playing' as const,
      problemsCompleted: 4,
      maxProblems: 5,
      player1Stats: {
        ...createInitialState().player1Stats,
        score: 30,
      },
      player2Stats: {
        ...createInitialState().player2Stats,
        score: 10,
      },
    };
    const next = nextProblem(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.currentProblem).toBeNull();
  });

  it('mid-game ungated next keeps difficulty', () => {
    const state = startGame(createInitialState('hard'));
    const next = nextProblem(state);
    expect(next.difficulty).toBe('hard');
    expect(next.problemsCompleted).toBe(1);
  });
});
