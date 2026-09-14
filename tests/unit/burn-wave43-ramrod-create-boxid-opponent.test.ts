/**
 * Wave 43 — createBoxId / getOpponent / CONFIG leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createBoxId,
  getOpponent,
  CONFIG,
} from '../../src/games/ramrod/types';

describe('Wave 43 ramrod — boxid opponent config', () => {
  it('createBoxId format; opponent involution; board size', () => {
    expect(createBoxId(1, 2)).toBe('box-1-2');
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent(getOpponent('player1'))).toBe('player1');
    expect(CONFIG.BOARD_ROWS * CONFIG.BOARD_COLS).toBe(12);
    expect(CONFIG.TARGET_SCORE).toBe(24);
  });
});
