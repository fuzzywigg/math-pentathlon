/**
 * Wave 41 handshake — Remainder chips/score helpers × stats formatWinRate.
 * Chrome-adjacent using real ui/stats-dashboard export. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getPlayerChips,
  getPlayerScore,
  createInitialState,
  INITIAL_CHIPS_PER_PLAYER,
} from '../../src/games/remainder-islands/types';
import { formatWinRate, formatPlayTime } from '../../src/ui/stats-dashboard';

describe('Wave 41 handshake — remainder × stats chrome', () => {
  it('opening chips/scores + winrate/playtime edges', () => {
    const state = createInitialState();
    expect(getPlayerChips(state, 'player1')).toBe(INITIAL_CHIPS_PER_PLAYER);
    expect(getPlayerChips(state, 'player2')).toBe(INITIAL_CHIPS_PER_PLAYER);
    expect(getPlayerScore(state, 'player1')).toBe(0);
    expect(getPlayerScore(state, 'player2')).toBe(0);

    const mid = {
      ...state,
      player1Chips: 7,
      player2Chips: 9,
      player1Score: 14,
      player2Score: 11,
    };
    expect(getPlayerChips(mid, 'player1')).toBe(7);
    expect(getPlayerScore(mid, 'player2')).toBe(11);

    expect(formatWinRate(0)).toBe('0%');
    expect(formatWinRate(1)).toBe('100%');
    expect(formatWinRate(0.25)).toBe('25%');
    expect(formatPlayTime(0)).toBe('0 min');
    expect(formatPlayTime(45 * 60_000)).toBe('45 min');
  });
});
