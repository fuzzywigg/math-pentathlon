/** Wave 42 — Pinball initial constants and createInitialState. Tests-only. */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  INITIAL_BALLS,
  MAX_ROUNDS,
  TARGET_POINTS,
  getOpponent,
} from '../../src/games/fraction-pinball/types';

describe('Wave 42 Pinball — initial constants', () => {
  it('exposes expected INITIAL_BALLS and MAX_ROUNDS', () => {
    expect(INITIAL_BALLS).toBe(5);
    expect(MAX_ROUNDS).toBe(10);
  });

  it('TARGET_POINTS matches ascending arcade values', () => {
    expect(TARGET_POINTS).toEqual([10, 20, 30, 50, 100]);
  });

  it('createInitialState wires balls and rounds from constants', () => {
    const state = createInitialState();
    expect(state.player1Stats.ballsRemaining).toBe(INITIAL_BALLS);
    expect(state.player2Stats.ballsRemaining).toBe(INITIAL_BALLS);
    expect(state.maxRounds).toBe(MAX_ROUNDS);
    expect(state.roundNumber).toBe(1);
    expect(state.targets).toHaveLength(TARGET_POINTS.length);
    expect(state.targets.map((t) => t.value)).toEqual(TARGET_POINTS);
  });

  it('initial scores and challenge fields are empty/null', () => {
    const state = createInitialState();
    expect(state.player1Stats.score).toBe(0);
    expect(state.player2Stats.score).toBe(0);
    expect(state.currentChallenge).toBeNull();
    expect(state.selectedAnswer).toBeNull();
    expect(state.isCorrect).toBeNull();
    expect(state.winner).toBeNull();
    expect(state.currentPlayer).toBe('player1');
    expect(state.phase).toBe('answering');
  });

  it('getOpponent flips seats', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });
});
