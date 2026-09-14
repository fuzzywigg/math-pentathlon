/**
 * Wave 41 — Hex game center has 6 neighbors; makeMove flips seat.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { getNeighbors, makeMove, isValidMove } from '../../src/games/hex/rules';

describe('Wave 41 hex game — center neighbors / seat', () => {
  it('interior cell has 6 neighbors', () => {
    const state = createInitialState();
    const mid = Math.floor(state.boardSize / 2);
    expect(getNeighbors({ row: mid, col: mid }, state.boardSize)).toHaveLength(6);
  });

  it('makeMove flips currentPlayer when no win', () => {
    const state = createInitialState();
    expect(state.currentPlayer).toBe('player1');
    const next = makeMove(state, { row: 1, col: 1 });
    expect(next.currentPlayer).toBe('player2');
    expect(isValidMove(next, { row: 1, col: 1 })).toBe(false);
  });
});
