/**
 * Wave 35 — Frac Fact AI null hard gates + format helpers + submit identity.
 * Tests-only. No product inventing.
 * Note: do not pin Math.random to a constant — generateDistractors can spin forever.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import {
  startGame,
  submitAnswer,
  nextProblem,
  checkAnswer,
  formatFraction,
  getOperationSymbol,
} from '../../src/games/frac-fact/rules';
import { getAIAnswer, isAITurn } from '../../src/games/frac-fact/ai';

describe('Wave 35 Frac Fact — AI null hard', () => {
  it('formatFraction + getOperationSymbol helpers', () => {
    expect(formatFraction({ numerator: 3, denominator: 1 })).toBe('3');
    expect(formatFraction({ numerator: 1, denominator: 2 })).toBe('1/2');
    expect(getOperationSymbol('add')).toBe('+');
    expect(getOperationSymbol('subtract')).toBe('−');
    expect(getOperationSymbol('multiply')).toBe('×');
    expect(getOperationSymbol('divide')).toBe('÷');
  });

  it('getAIAnswer null on showingResult / gameOver / wrong seat / null problem', () => {
    const base = startGame(createInitialState());
    expect(getAIAnswer({ ...base, phase: 'showingResult' }, 'player1', 'hard')).toBeNull();
    expect(getAIAnswer({ ...base, phase: 'gameOver', winner: 'player1' }, 'player1', 'hard')).toBeNull();
    expect(getAIAnswer(base, 'player2', 'hard')).toBeNull();
    expect(getAIAnswer({ ...base, currentProblem: null }, 'player1', 'hard')).toBeNull();
  });

  it('submitAnswer identity when currentProblem null', () => {
    const state = {
      ...createInitialState(),
      phase: 'playing' as const,
      currentProblem: null,
    };
    expect(submitAnswer(state, { numerator: 1, denominator: 1 })).toBe(state);
  });

  it('checkAnswer true for equivalent unreduced fraction', () => {
    const state = startGame(createInitialState());
    const problem = state.currentProblem!;
    const unreduced = {
      numerator: problem.correctAnswer.numerator * 2,
      denominator: problem.correctAnswer.denominator * 2,
    };
    expect(checkAnswer(problem, unreduced)).toBe(true);
  });

  it('nextProblem at maxProblems settles winner by score or null tie', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      problemsCompleted: state.maxProblems - 1,
      player1Stats: { ...state.player1Stats, score: 10 },
      player2Stats: { ...state.player2Stats, score: 10 },
      phase: 'showingResult',
    };
    const next = nextProblem(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBeNull();
  });

  it('nextProblem unequal scores picks leader', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      problemsCompleted: state.maxProblems - 1,
      player1Stats: { ...state.player1Stats, score: 30 },
      player2Stats: { ...state.player2Stats, score: 10 },
      phase: 'showingResult',
    };
    const next = nextProblem(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
  });

  it('isAITurn false when not playing / wrong seat', () => {
    const state = startGame(createInitialState());
    expect(isAITurn(state, null)).toBe(false);
    expect(isAITurn(state, 'player2')).toBe(false);
    expect(isAITurn(state, 'player1')).toBe(true);
  });
});
