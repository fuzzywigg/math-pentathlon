/** Wave 42 — Pinball wrong answer never bumps score. Tests-only. */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  INITIAL_BALLS,
} from '../../src/games/fraction-pinball/types';
import { startGame, submitAnswer } from '../../src/games/fraction-pinball/rules';

describe('Wave 42 Pinball — wrong no score bump', () => {
  it('wrong from zero keeps score at zero', () => {
    let state = startGame(createInitialState());
    state = submitAnswer(state, '__nope__');
    expect(state.isCorrect).toBe(false);
    expect(state.player1Stats.score).toBe(0);
    expect(state.player1Stats.wrongAnswers).toBe(1);
  });

  it('wrong with prior score leaves score unchanged', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      player1Stats: {
        ...state.player1Stats,
        score: 70,
        correctAnswers: 3,
      },
    };
    state = submitAnswer(state, 'not-the-answer');
    expect(state.player1Stats.score).toBe(70);
    expect(state.player1Stats.correctAnswers).toBe(3);
    expect(state.player1Stats.wrongAnswers).toBe(1);
  });

  it('wrong drains exactly one ball', () => {
    let state = startGame(createInitialState());
    state = submitAnswer(state, 'x');
    expect(state.player1Stats.ballsRemaining).toBe(INITIAL_BALLS - 1);
  });

  it('opponent score untouched on player1 miss', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      player2Stats: { ...state.player2Stats, score: 15 },
    };
    state = submitAnswer(state, 'miss');
    expect(state.player2Stats.score).toBe(15);
    expect(state.player2Stats.ballsRemaining).toBe(INITIAL_BALLS);
  });

  it('phase becomes showResult after wrong', () => {
    let state = startGame(createInitialState());
    state = submitAnswer(state, 'zzz');
    expect(state.phase).toBe('showResult');
    expect(state.selectedAnswer).toBe('zzz');
  });
});
