/**
 * Wave 45 TOKENMAXX — Remainder getPlayerChips/Score leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getPlayerChips,
  getPlayerScore,
  INITIAL_CHIPS_PER_PLAYER,
} from '../../src/games/remainder-islands/types';

describe('Wave 45 remainder — chips/score helpers', () => {
  it('opening chips and mid-game flip', () => {
    const open = createInitialState();
    expect(getPlayerChips(open, 'player1')).toBe(INITIAL_CHIPS_PER_PLAYER);
    expect(getPlayerScore(open, 'player2')).toBe(0);
    const mid = { ...open, player1Chips: 7, player2Score: 11 };
    expect(getPlayerChips(mid, 'player1')).toBe(7);
    expect(getPlayerScore(mid, 'player2')).toBe(11);
  });
});
