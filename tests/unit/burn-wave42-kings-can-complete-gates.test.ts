/**
 * Wave 42 — Kings canCompleteTurn supply / moves gates.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  canCompleteTurn,
  findKingPosition,
  getValidKingMoves,
} from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — canCompleteTurn gates', () => {
  it('opening both seats can complete', () => {
    const state = createInitialGameState();
    expect(canCompleteTurn(state, 'player1')).toBe(true);
    expect(canCompleteTurn(state, 'player2')).toBe(true);
  });

  it('zero supply blocks even with king moves', () => {
    const state = createInitialGameState();
    expect(getValidKingMoves(state, 'player1').length).toBeGreaterThan(0);
    const starved: GameState = { ...state, player1Supply: 0 };
    expect(canCompleteTurn(starved, 'player1')).toBe(false);
    expect(canCompleteTurn(starved, 'player2')).toBe(true);
  });

  it('trapped king blocks even with supply', () => {
    const state = createInitialGameState();
    const board = state.board.map((row) =>
      row.map((c) => (c ? { ...c } : null))
    );
    const king = findKingPosition(board, 'player2')!;
    for (const dr of [-1, 0, 1]) {
      for (const dc of [-1, 0, 1]) {
        if (dr === 0 && dc === 0) continue;
        const r = king.row + dr;
        const c = king.col + dc;
        if (r < 0 || r > 8 || c < 0 || c > 8) continue;
        if (board[r][c]?.type === 'king') continue;
        board[r][c] = { type: 'quadraphage', owner: 'player1' };
      }
    }
    const trapped: GameState = { ...state, board, player2Supply: 30 };
    expect(canCompleteTurn(trapped, 'player2')).toBe(false);
    expect(canCompleteTurn(trapped, 'player1')).toBe(true);
  });
});
