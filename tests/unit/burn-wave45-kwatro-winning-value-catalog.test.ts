/**
 * Wave 45 TOKENMAXX — Kwatro isWinningValue + CONFIG leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  CONFIG,
  PLAYER_CHIPS,
  isWinningValue,
  getOpponent,
  createChip,
} from '../../src/games/kwatro-sinko/types';

describe('Wave 45 kwatro — winning value catalog', () => {
  it('targets 4/5 and chip parity sets', () => {
    expect(CONFIG.TARGET_VALUES).toEqual([4, 5]);
    expect(isWinningValue(4)).toBe(true);
    expect(isWinningValue(5)).toBe(true);
    expect(isWinningValue(3)).toBe(false);
    expect(PLAYER_CHIPS.player1.every((n) => n % 2 === 0)).toBe(true);
    expect(PLAYER_CHIPS.player2.every((n) => n % 2 === 1)).toBe(true);
    expect(createChip('x', 4, 'player1').position).toBeNull();
    expect(getOpponent('player1')).toBe('player2');
  });
});
