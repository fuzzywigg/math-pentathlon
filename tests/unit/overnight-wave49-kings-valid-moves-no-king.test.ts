/**
 * Wave 49 — Kings getValidKingMoves empty when king missing leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { BOARD_SIZE, type Board } from '../../src/games/kings-quadraphages/board';
import { getValidKingMoves } from '../../src/games/kings-quadraphages/rules';

describe('Wave 49 kings — no-king valids', () => {
  it('returns [] when player king is absent', () => {
    const board: Board = Array.from({ length: BOARD_SIZE }, () =>
      Array.from({ length: BOARD_SIZE }, () => null)
    );
    const state = { board, player1Supply: 30, player2Supply: 30 };
    expect(getValidKingMoves(state, 'player1')).toEqual([]);
  });
});
