/**
 * Wave 42 — Handshake kings rules ↔ game-state move agreement.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  isValidKingMove,
  getValidKingMoves,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  isValidMove,
  moveKing,
  getKingPosition,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — rules↔game-state handshake', () => {
  it('every rules valid move is game-state isValidMove (1-based)', () => {
    const state = createInitialGameState();
    const rulesMoves = getValidKingMoves(state, 'player1');
    for (const m of rulesMoves) {
      const oneBased = { row: m.row + 1, col: m.col + 1 };
      expect(isValidMove(state, oneBased)).toBe(true);
      expect(isValidKingMove(state, 'player1', m)).toBe(true);
    }
  });

  it('moveKing dest agrees with findKing / getKingPosition', () => {
    let state = createInitialGameState();
    const dest = { row: 2, col: 6 };
    expect(isValidMove(state, dest)).toBe(true);
    expect(
      isValidKingMove(state, 'player1', { row: dest.row - 1, col: dest.col - 1 })
    ).toBe(true);
    state = moveKing(state, dest);
    expect(getKingPosition(state, 'player1')).toEqual(dest);
    expect(findKingPosition(state.board, 'player1')).toEqual({
      row: dest.row - 1,
      col: dest.col - 1,
    });
  });

  it('far leap rejected by both layers identically', () => {
    const state = createInitialGameState();
    const far = { row: 5, col: 5 };
    expect(isValidMove(state, far)).toBe(false);
    expect(
      isValidKingMove(state, 'player1', { row: far.row - 1, col: far.col - 1 })
    ).toBe(false);
    expect(moveKing(state, far)).toBe(state);
  });
});
