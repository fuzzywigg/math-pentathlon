/**
 * Wave 55 leftover after #250 — Kings getKingPosition null + selectKing identity. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  getKingPosition,
  selectKing,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 55 kings — select with no king', () => {
  it('cleared kings return null and identity select', () => {
    const state = createInitialGameState();
    const empty = {
      ...state,
      board: state.board.map((row) => row.map(() => null)),
    };
    expect(getKingPosition(empty, 'player1')).toBeNull();
    expect(selectKing(empty)).toBe(empty);
  });
});
