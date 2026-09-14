/**
 * Wave 46 — Pent BOARD_SIZE / PIECES_PER_PLAYER leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  BOARD_SIZE,
  PIECES_PER_PLAYER,
  createInitialState,
  getOpponent,
} from '../../src/games/pent-em-in/types';

describe('Wave 46 pent — board constants', () => {
  it('10×10 board; 12 pieces; opponent swap', () => {
    expect(BOARD_SIZE).toBe(10);
    expect(PIECES_PER_PLAYER).toBe(12);
    const state = createInitialState();
    expect(state.board).toHaveLength(BOARD_SIZE);
    expect(state.board[0]).toHaveLength(BOARD_SIZE);
    expect(getOpponent('player1')).toBe('player2');
  });
});
