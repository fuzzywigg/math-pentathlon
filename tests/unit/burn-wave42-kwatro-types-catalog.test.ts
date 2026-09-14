/**
 * Wave 42 — Kwatro-Sinko types helpers and CONFIG catalogs. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  CONFIG,
  PLAYER_CHIPS,
  getOpponent,
  createChip,
  isWinningValue,
} from '../../src/games/kwatro-sinko/types';

describe('Wave 42 kwatro-sinko — types catalog', () => {
  it('CONFIG.TARGET_VALUES lists 4 and 5 only', () => {
    expect(CONFIG.TARGET_VALUES).toEqual([4, 5]);
    expect(CONFIG.TARGET_VALUES).toHaveLength(2);
  });

  it('isWinningValue accepts 4 and 5 and rejects neighbors', () => {
    expect(isWinningValue(4)).toBe(true);
    expect(isWinningValue(5)).toBe(true);
    expect(isWinningValue(3)).toBe(false);
    expect(isWinningValue(6)).toBe(false);
    expect(isWinningValue(0)).toBe(false);
  });

  it('getOpponent alternates player1 and player2', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
    expect(getOpponent(getOpponent('player1'))).toBe('player1');
  });

  it('createChip and PLAYER_CHIPS values are consistent per side', () => {
    const even = createChip('e', 8, 'player1');
    expect(even.position).toBeNull();
    expect(even.owner).toBe('player1');
    expect(PLAYER_CHIPS.player1.every((v) => v % 2 === 0)).toBe(true);
    expect(PLAYER_CHIPS.player2.every((v) => v % 2 === 1)).toBe(true);
  });
});
