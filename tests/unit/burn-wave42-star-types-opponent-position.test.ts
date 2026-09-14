/**
 * Wave 42 — Star Track types getOpponent / getPlayerPosition. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getOpponent,
  getPlayerPosition,
  TRACK_LENGTH,
} from '../../src/games/star-track/types';

describe('Wave 42 star-track — types helpers', () => {
  it('opponent flip; positions read seats; track length 12', () => {
    expect(TRACK_LENGTH).toBe(12);
    expect(getOpponent('player1')).toBe('player2');
    const s = { ...createInitialState(), player1Position: 3, player2Position: 7 };
    expect(getPlayerPosition(s, 'player1')).toBe(3);
    expect(getPlayerPosition(s, 'player2')).toBe(7);
  });
});
