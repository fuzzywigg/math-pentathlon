/**
 * Wave 41 — Kings rules isValidKingMove OOB / occupied / stay matrix. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  isValidKingMove,
  getValidKingMoves,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 41 kings — isValidKingMove reject matrix', () => {
  it('OOB destinations false', () => {
    const state = createInitialGameState();
    expect(isValidKingMove(state, 'player1', { row: -1, col: 4 })).toBe(false);
    expect(isValidKingMove(state, 'player1', { row: 0, col: -1 })).toBe(false);
    expect(isValidKingMove(state, 'player1', { row: 9, col: 4 })).toBe(false);
    expect(isValidKingMove(state, 'player1', { row: 0, col: 9 })).toBe(false);
  });

  it('stay-in-place and far leaps false', () => {
    const state = createInitialGameState();
    const king = findKingPosition(state.board, 'player1')!;
    expect(isValidKingMove(state, 'player1', king)).toBe(false);
    expect(
      isValidKingMove(state, 'player1', { row: king.row + 2, col: king.col })
    ).toBe(false);
  });

  it('occupied by own king / enemy king false', () => {
    const state = createInitialGameState();
    const p2 = findKingPosition(state.board, 'player2')!;
    // Forge: move p2 adjacent to p1 then try occupy
    const p1 = findKingPosition(state.board, 'player1')!;
    expect(isValidKingMove(state, 'player1', p2)).toBe(false);
    expect(isValidKingMove(state, 'player2', p1)).toBe(false);
  });

  it('opening player1 has adjacent empties as valid moves', () => {
    const state = createInitialGameState();
    const moves = getValidKingMoves(state, 'player1');
    expect(moves.length).toBeGreaterThan(0);
    for (const m of moves) {
      expect(isValidKingMove(state, 'player1', m)).toBe(true);
      expect(state.board[m.row][m.col]).toBeNull();
    }
  });
});
