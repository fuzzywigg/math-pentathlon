/**
 * Wave 42 leftovers D — Hex-a-Gone isValidPosition matrix. Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  getCellAt,
  isValidPosition,
  getOpponent,
} from '../../src/games/hex-a-gone/types';

describe('Wave 42 hexagone — isValidPosition / getCellAt / getOpponent', () => {
  it('isValidPosition and getCellAt hit on-board cells', () => {
    const state = createInitialState();
    expect(isValidPosition(state, 0, 0)).toBe(true);
    expect(getCellAt(state, 0, 0)).toEqual(
      expect.objectContaining({ q: 0, r: 0, filled: false })
    );
    expect(isValidPosition(state, 3, 0)).toBe(true);
    expect(getCellAt(state, 3, 0)?.q).toBe(3);
  });

  it('isValidPosition and getCellAt miss OOB', () => {
    const state = createInitialState();
    expect(isValidPosition(state, 4, 0)).toBe(false);
    expect(getCellAt(state, 4, 0)).toBeUndefined();
    expect(isValidPosition(state, 99, -99)).toBe(false);
    expect(getCellAt(state, -4, -4)).toBeUndefined();
  });

  it('getOpponent flips seats', () => {
    expect(getOpponent('player1')).toBe('player2');
    expect(getOpponent('player2')).toBe('player1');
  });
});
