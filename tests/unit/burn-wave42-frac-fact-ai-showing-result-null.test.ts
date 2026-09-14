/** Wave 42 — Frac Fact AI null when showingResult / wrong seat. Tests-only. */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame, submitAnswer } from '../../src/games/frac-fact/rules';
import { getAIAnswer, isAITurn } from '../../src/games/frac-fact/ai';

afterEach(() => vi.restoreAllMocks());

describe('Wave 42 Frac Fact — AI showingResult null', () => {
  it('getAIAnswer returns null after submit moves to showingResult', () => {
    let state = startGame(createInitialState('easy'));
    state = submitAnswer(state, state.currentProblem!.correctAnswer);
    expect(state.phase).toBe('showingResult');
    expect(getAIAnswer(state, 'player1', 'hard')).toBeNull();
    expect(getAIAnswer(state, 'player2', 'medium')).toBeNull();
  });

  it('isAITurn false while showingResult', () => {
    let state = startGame(createInitialState('easy'));
    state = submitAnswer(state, state.currentProblem!.correctAnswer);
    expect(isAITurn(state, 'player1')).toBe(false);
    expect(isAITurn(state, 'player2')).toBe(false);
  });

  it('getAIAnswer null on gameOver phase', () => {
    const state = {
      ...startGame(createInitialState('easy')),
      phase: 'gameOver' as const,
      winner: 'player1' as const,
    };
    expect(getAIAnswer(state, 'player1', 'easy')).toBeNull();
  });

  it('getAIAnswer null when seat mismatch even in playing', () => {
    const state = startGame(createInitialState('medium'));
    expect(state.currentPlayer).toBe('player1');
    expect(getAIAnswer(state, 'player2', 'hard')).toBeNull();
  });

  it('getAIAnswer null when currentProblem is null', () => {
    const state = {
      ...createInitialState('easy'),
      phase: 'playing' as const,
      currentProblem: null,
    };
    expect(getAIAnswer(state, 'player1', 'medium')).toBeNull();
  });
});
