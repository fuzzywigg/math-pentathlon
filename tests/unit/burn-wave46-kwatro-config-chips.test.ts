/**
 * Wave 46 — Kwatro CONFIG / PLAYER_CHIPS leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { CONFIG, PLAYER_CHIPS, getOpponent } from '../../src/games/kwatro-sinko/types';

describe('Wave 46 kwatro — config chips', () => {
  it('target 4/5; p1 evens p2 odds; opponent', () => {
    expect(CONFIG.TARGET_VALUES).toEqual([4, 5]);
    expect(PLAYER_CHIPS.player1).toEqual([0, 2, 4, 6, 8]);
    expect(PLAYER_CHIPS.player2).toEqual([1, 3, 5, 7, 9]);
    expect(getOpponent('player2')).toBe('player1');
  });
});
