/**
 * Wave 42 — Kings getValidKingMoves player2 edge opening leftovers.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  getValidKingMoves,
  isValidKingMove,
} from '../../src/games/kings-quadraphages/rules';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — player2 opening mobility', () => {
  it('player2 has exactly 5 opening moves on bottom edge', () => {
    const state = createInitialGameState();
    const moves = getValidKingMoves(state, 'player2');
    expect(moves).toHaveLength(5);
    expect(moves.every((m) => m.row === 7 || m.row === 8)).toBe(true);
  });

  it('player2 cannot move off bottom edge', () => {
    const state = createInitialGameState();
    expect(isValidKingMove(state, 'player2', { row: 9, col: 4 })).toBe(false);
    expect(isValidKingMove(state, 'player2', { row: 8, col: 4 })).toBe(false);
  });

  it('diagonal up-left/up-right from p2 are valid', () => {
    const state = createInitialGameState();
    expect(isValidKingMove(state, 'player2', { row: 7, col: 3 })).toBe(true);
    expect(isValidKingMove(state, 'player2', { row: 7, col: 5 })).toBe(true);
    expect(isValidKingMove(state, 'player2', { row: 7, col: 4 })).toBe(true);
  });
});
