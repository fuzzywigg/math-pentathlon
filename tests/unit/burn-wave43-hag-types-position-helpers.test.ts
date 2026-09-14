/**
 * Wave 43 — Hex-a-Gone position helpers leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getCellAt,
  isValidPosition,
  getOpponent,
} from '../../src/games/hex-a-gone/types';

describe('Wave 43 hag — position helpers', () => {
  it('getCellAt miss / isValidPosition edges / getOpponent', () => {
    const s = createInitialState();
    expect(getCellAt(s, 0, 0)).toBeTruthy();
    expect(getCellAt(s, 99, 99)).toBeUndefined();
    expect(isValidPosition(s, 0, 0)).toBe(true);
    expect(isValidPosition(s, 99, 99)).toBe(false);
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });
});
