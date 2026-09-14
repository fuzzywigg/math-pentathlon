/**
 * Overnight TOKENMAXX — Hex types size/opponent leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  createEmptyBoard,
  DEFAULT_BOARD_SIZE,
  getOpponent,
} from '../../src/games/hex/types';

describe('Overnight hex — types helpers', () => {
  it('custom size and defaults', () => {
    expect(createInitialState(3).boardSize).toBe(3);
    expect(createEmptyBoard().length).toBe(DEFAULT_BOARD_SIZE);
    expect(getOpponent('player2')).toBe('player1');
  });
});
