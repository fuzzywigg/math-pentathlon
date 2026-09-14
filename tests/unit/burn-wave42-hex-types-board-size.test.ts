/**
 * Wave 42 — Hex game types board factory + opponent. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  createInitialState,
  getOpponent,
  DEFAULT_BOARD_SIZE,
} from '../../src/games/hex/types';

describe('Wave 42 hex-game — types board', () => {
  it('default 11; empty board null cells; opponent flip', () => {
    expect(DEFAULT_BOARD_SIZE).toBe(11);
    const b = createEmptyBoard(3);
    expect(b).toHaveLength(3);
    expect(b.every((row) => row.every((c) => c === null))).toBe(true);
    expect(createInitialState().boardSize).toBe(11);
    expect(getOpponent('player1')).toBe('player2');
  });
});
