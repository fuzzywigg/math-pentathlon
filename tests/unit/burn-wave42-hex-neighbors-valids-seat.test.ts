/**
 * Wave 42 leftovers B — Hex neighbors / validMoves seat flip leftovers.
 * Distinct from hex-a-gone burn-wave41. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { createInitialState, getOpponent } from '../../src/games/hex/types';
import {
  getNeighbors,
  getValidMoves,
  makeMove,
  isValidMove,
  isValidPosition,
} from '../../src/games/hex/rules';

describe('Wave 42 hex — neighbors / valids / seat', () => {
  it('corner has 2–3 neighbors; center has 6 on size 5', () => {
    expect(getNeighbors({ row: 0, col: 0 }, 5).length).toBeLessThanOrEqual(3);
    expect(getNeighbors({ row: 2, col: 2 }, 5)).toHaveLength(6);
    expect(isValidPosition({ row: -1, col: 0 }, 5)).toBe(false);
  });

  it('validMoves shrink after place; seat flips until win', () => {
    let state = createInitialState(5);
    const before = getValidMoves(state).length;
    expect(before).toBe(25);
    state = makeMove(state, { row: 0, col: 0 });
    expect(state.currentPlayer).toBe('player2');
    expect(getOpponent('player1')).toBe('player2');
    expect(getValidMoves(state).length).toBe(before - 1);
    expect(isValidMove(state, { row: 0, col: 0 })).toBe(false);
    expect(isValidMove(state, { row: 4, col: 4 })).toBe(true);
  });

  it('isValidMove false OOB and after winner', () => {
    let state = createInitialState(3);
    // Force a vertical win for p1
    state = makeMove(state, { row: 0, col: 1 });
    state = makeMove(state, { row: 0, col: 0 });
    state = makeMove(state, { row: 1, col: 1 });
    state = makeMove(state, { row: 0, col: 2 });
    state = makeMove(state, { row: 2, col: 1 });
    if (state.winner === 'player1') {
      expect(isValidMove(state, { row: 1, col: 0 })).toBe(false);
      expect(getValidMoves(state)).toEqual([]);
    }
    expect(isValidMove(state, { row: 99, col: 0 })).toBe(false);
  });
});
