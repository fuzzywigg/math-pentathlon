/**
 * Overnight TOKENMAXX HEAVY leftovers after #250 — Pinball getOpponent + getPlayerStats leftover.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getOpponent,
  getPlayerStats,
} from '../../src/games/fraction-pinball/types';

describe('Wave 55 pinball types — opponent stats', () => {
  it('maps opponent and player2 stats leftover', () => {
    expect(getOpponent('player2')).toBe('player1');
    const s = {
      ...createInitialState(),
      player2Stats: {
        score: 70,
        correctAnswers: 3,
        wrongAnswers: 1,
        ballsRemaining: 4,
      },
    };
    expect(getPlayerStats(s, 'player2').score).toBe(70);
    expect(getPlayerStats(s, 'player1').ballsRemaining).toBe(5);
  });
});
