/**
 * Wave 42 — Pinball INITIAL_BALLS / TARGET_POINTS / opponent. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getOpponent,
  getPlayerStats,
  INITIAL_BALLS,
  MAX_ROUNDS,
  TARGET_POINTS,
} from '../../src/games/fraction-pinball/types';

describe('Wave 42 pinball — types constants', () => {
  it('balls/rounds/targets wired into initial state', () => {
    const s = createInitialState();
    expect(s.player1Stats.ballsRemaining).toBe(INITIAL_BALLS);
    expect(s.maxRounds).toBe(MAX_ROUNDS);
    expect(s.targets.map((t) => t.value)).toEqual(TARGET_POINTS);
    expect(getOpponent('player1')).toBe('player2');
    expect(getPlayerStats(s, 'player2').score).toBe(0);
  });
});
