/** Wave 42 — Remainder getPlayerChips / getPlayerScore helpers. Tests-only. */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  getPlayerChips,
  getPlayerScore,
  INITIAL_CHIPS_PER_PLAYER,
} from '../../src/games/remainder-islands/types';

describe('Wave 42 remainder — helpers chips score', () => {
  it('opening chips match INITIAL_CHIPS_PER_PLAYER', () => {
    const state = createInitialState();
    expect(getPlayerChips(state, 'player1')).toBe(INITIAL_CHIPS_PER_PLAYER);
    expect(getPlayerChips(state, 'player2')).toBe(INITIAL_CHIPS_PER_PLAYER);
  });

  it('opening scores are zero', () => {
    const state = createInitialState();
    expect(getPlayerScore(state, 'player1')).toBe(0);
    expect(getPlayerScore(state, 'player2')).toBe(0);
  });

  it('helpers reflect forged mid-game chips', () => {
    const mid = {
      ...createInitialState(),
      player1Chips: 2,
      player2Chips: 11,
    };
    expect(getPlayerChips(mid, 'player1')).toBe(2);
    expect(getPlayerChips(mid, 'player2')).toBe(11);
  });

  it('helpers reflect forged mid-game scores', () => {
    const mid = {
      ...createInitialState(),
      player1Score: 17,
      player2Score: 4,
    };
    expect(getPlayerScore(mid, 'player1')).toBe(17);
    expect(getPlayerScore(mid, 'player2')).toBe(4);
  });

  it('zero chips and scores readable via helpers', () => {
    const empty = {
      ...createInitialState(),
      player1Chips: 0,
      player2Chips: 0,
      player1Score: 0,
      player2Score: 0,
    };
    expect(getPlayerChips(empty, 'player1')).toBe(0);
    expect(getPlayerScore(empty, 'player2')).toBe(0);
  });
});
