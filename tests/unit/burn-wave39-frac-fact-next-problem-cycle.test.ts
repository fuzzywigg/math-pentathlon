/**
 * Wave 39 — Frac Fact startGame / nextProblem mid-game cycle.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  DEFAULT_MAX_PROBLEMS,
} from '../../src/games/frac-fact/types';
import { startGame, submitAnswer, nextProblem } from '../../src/games/frac-fact/rules';

describe('Wave 39 Frac Fact — next problem cycle', () => {
  it('startGame seeds problem and resets history counters', () => {
    const state = startGame({
      ...createInitialState('medium'),
      maxProblems: 6,
    });
    expect(state.currentProblem).not.toBeNull();
    expect(state.phase).toBe('playing');
    expect(state.problemsCompleted).toBe(0);
    expect(state.maxProblems).toBe(6);
    expect(state.difficulty).toBe('medium');
  });

  it('nextProblem mid-game swaps seat and loads new problem', () => {
    let state = startGame(createInitialState('easy'));
    state = submitAnswer(state, state.currentProblem!.correctAnswer);
    const prevId = state.currentProblem!.id;
    state = nextProblem(state);
    expect(state.phase).toBe('playing');
    expect(state.currentPlayer).toBe('player2');
    expect(state.problemsCompleted).toBe(1);
    expect(state.currentProblem).not.toBeNull();
    expect(state.selectedAnswer).toBeNull();
    expect(state.isCorrect).toBeNull();
    expect(state.currentProblem!.id).not.toBe(prevId);
  });

  it('DEFAULT_MAX_PROBLEMS used when omitted', () => {
    expect(createInitialState().maxProblems).toBe(DEFAULT_MAX_PROBLEMS);
  });

  it('nextProblem from showingResult advances problemsCompleted', () => {
    const state = startGame(createInitialState());
    const next = nextProblem({ ...state, phase: 'showingResult' });
    expect(next.problemsCompleted).toBe(1);
  });
});
