/** Wave 42 — Pinball dual balls exhausted ends game. Tests-only. */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/fraction-pinball/types';
import { startGame, nextChallenge } from '../../src/games/fraction-pinball/rules';

describe('Wave 42 Pinball — dual balls exhaust over', () => {
  it('both seats at 0 balls → gameOver even mid maxRounds', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      phase: 'showResult',
      roundNumber: 3,
      player1Stats: { ...state.player1Stats, ballsRemaining: 0, score: 30 },
      player2Stats: { ...state.player2Stats, ballsRemaining: 0, score: 10 },
    };
    const next = nextChallenge(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player1');
    expect(next.currentChallenge).toBeNull();
  });

  it('one seat still has balls → continue', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      phase: 'showResult',
      roundNumber: 2,
      player1Stats: { ...state.player1Stats, ballsRemaining: 0, score: 10 },
      player2Stats: { ...state.player2Stats, ballsRemaining: 2, score: 10 },
    };
    const next = nextChallenge(state);
    expect(next.phase).toBe('answering');
    expect(next.winner).toBeNull();
    expect(next.currentChallenge).not.toBeNull();
  });

  it('dual exhaust with p2 lead awards player2', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      phase: 'showResult',
      player1Stats: { ...state.player1Stats, ballsRemaining: 0, score: 5 },
      player2Stats: { ...state.player2Stats, ballsRemaining: 0, score: 80 },
    };
    const next = nextChallenge(state);
    expect(next.phase).toBe('gameOver');
    expect(next.winner).toBe('player2');
  });

  it('dual exhaust clears selection fields', () => {
    let state = startGame(createInitialState());
    state = {
      ...state,
      phase: 'showResult',
      selectedAnswer: '0.5',
      isCorrect: false,
      player1Stats: { ...state.player1Stats, ballsRemaining: 0, score: 0 },
      player2Stats: { ...state.player2Stats, ballsRemaining: 0, score: 0 },
    };
    const next = nextChallenge(state);
    expect(next.selectedAnswer).toBeNull();
    expect(next.isCorrect).toBeNull();
    expect(next.winner).toBeNull();
  });
});
