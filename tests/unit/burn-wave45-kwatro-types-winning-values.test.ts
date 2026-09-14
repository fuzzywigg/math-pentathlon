/**
 * Wave 45 — Kwatro isWinningValue / createChip leftovers after #208. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { isWinningValue, createChip, getOpponent, CONFIG } from '../../src/games/kwatro-sinko/types';

describe('Wave 45 kwatro — types helpers', () => {
  it('winning values only 4/5; chip shape; opponent', () => {
    expect(isWinningValue(4)).toBe(true);
    expect(isWinningValue(5)).toBe(true);
    expect(isWinningValue(3)).toBe(false);
    expect(CONFIG.TARGET_VALUES).toEqual([4, 5]);
    const chip = createChip('c1', 6, 'player1');
    expect(chip).toEqual({ id: 'c1', value: 6, owner: 'player1', position: null });
    expect(getOpponent('player1')).toBe('player2');
  });
});
