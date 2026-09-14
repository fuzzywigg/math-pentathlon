/** Wave 42 — Frac Fact bestStreak update on correct submit. Tests-only. */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/frac-fact/types';
import { startGame, submitAnswer } from '../../src/games/frac-fact/rules';

describe('Wave 42 Frac Fact — best streak update', () => {
  it('first correct sets bestStreak to 1 from zero', () => {
    let state = startGame(createInitialState('easy'));
    expect(state.player1Stats.bestStreak).toBe(0);
    state = submitAnswer(state, state.currentProblem!.correctAnswer);
    expect(state.player1Stats.currentStreak).toBe(1);
    expect(state.player1Stats.bestStreak).toBe(1);
  });

  it('correct answer raises bestStreak when current+1 exceeds prior best', () => {
    let state = startGame(createInitialState('easy'));
    state = {
      ...state,
      player1Stats: {
        ...state.player1Stats,
        currentStreak: 3,
        bestStreak: 3,
      },
    };
    state = submitAnswer(state, state.currentProblem!.correctAnswer);
    expect(state.player1Stats.currentStreak).toBe(4);
    expect(state.player1Stats.bestStreak).toBe(4);
  });

  it('correct answer keeps bestStreak when already higher', () => {
    let state = startGame(createInitialState('easy'));
    state = {
      ...state,
      player1Stats: {
        ...state.player1Stats,
        currentStreak: 0,
        bestStreak: 7,
      },
    };
    state = submitAnswer(state, state.currentProblem!.correctAnswer);
    expect(state.player1Stats.currentStreak).toBe(1);
    expect(state.player1Stats.bestStreak).toBe(7);
  });

  it('wrong answer does not lower bestStreak', () => {
    let state = startGame(createInitialState('easy'));
    state = {
      ...state,
      player1Stats: {
        ...state.player1Stats,
        currentStreak: 2,
        bestStreak: 5,
      },
    };
    state = submitAnswer(state, { numerator: 999, denominator: 1 });
    expect(state.player1Stats.currentStreak).toBe(0);
    expect(state.player1Stats.bestStreak).toBe(5);
  });
});
