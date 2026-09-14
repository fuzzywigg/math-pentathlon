/**
 * Wave 45 TOKENMAXX — Pinball types/config catalog leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  INITIAL_BALLS,
  MAX_ROUNDS,
  TARGET_POINTS,
  createInitialState,
  getOpponent,
  getPlayerStats,
} from '../../src/games/fraction-pinball/types';

describe('Wave 45 pinball — types catalog', () => {
  it('balls/rounds/targets and helpers', () => {
    expect(INITIAL_BALLS).toBe(5);
    expect(MAX_ROUNDS).toBe(10);
    expect(TARGET_POINTS).toEqual([10, 20, 30, 50, 100]);
    const s = createInitialState();
    expect(s.targets).toHaveLength(5);
    expect(getPlayerStats(s, 'player1').ballsRemaining).toBe(INITIAL_BALLS);
    expect(getOpponent('player1')).toBe('player2');
  });
});
