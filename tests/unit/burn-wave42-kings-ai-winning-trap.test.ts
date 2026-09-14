/**
 * Wave 42 leftovers B — Kings hard AI prefers winning trap placement.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';

import { getBestMove, getAIMove } from '../../src/games/kings-quadraphages/ai';
import {
  createInitialGameState,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';
import {
  findKingPosition,
  getValidKingMoves,
} from '../../src/games/kings-quadraphages/rules';

/**
 * Almost-trap player2: leave exactly one escape cell empty adjacent to p2 king.
 * After AI (player1) moves king elsewhere, a winning quad can fill that escape.
 */
function nearlyTrapP2(): GameState {
  const state = createInitialGameState();
  const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
  const p2 = findKingPosition(board, 'player2')!;
  const escapes: { row: number; col: number }[] = [];
  for (const dr of [-1, 0, 1]) {
    for (const dc of [-1, 0, 1]) {
      if (dr === 0 && dc === 0) continue;
      const r = p2.row + dr;
      const c = p2.col + dc;
      if (r < 0 || r > 8 || c < 0 || c > 8) continue;
      if (board[r][c]?.type === 'king') continue;
      escapes.push({ row: r, col: c });
    }
  }
  // Fill all but one escape
  for (let i = 0; i < escapes.length - 1; i++) {
    const e = escapes[i];
    board[e.row][e.col] = { type: 'quadraphage', owner: 'player1' };
  }
  return { ...state, board, currentPlayer: 'player1', turnPhase: 'moveKing' };
}

describe('Wave 42 kings — hard AI winning trap preference', () => {
  it('getBestMove returns legal move on near-trap board', () => {
    const state = nearlyTrapP2();
    expect(getValidKingMoves(state, 'player2').length).toBe(1);
    const move = getBestMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    const legal = getValidKingMoves(state, 'player1');
    expect(
      legal.some(
        (m) => m.row === move!.kingMove.row && m.col === move!.kingMove.col
      )
    ).toBe(true);
  });

  it('hard getAIMove also returns a complete AIMove', () => {
    const state = nearlyTrapP2();
    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.quadraphagePlacement).toBeDefined();
  });

  it('null when current player has zero king moves', () => {
    const state = createInitialGameState();
    const board = state.board.map((row) =>
      row.map((c) => (c ? { ...c } : null))
    );
    const p1 = findKingPosition(board, 'player1')!;
    for (const dr of [-1, 0, 1]) {
      for (const dc of [-1, 0, 1]) {
        if (dr === 0 && dc === 0) continue;
        const r = p1.row + dr;
        const c = p1.col + dc;
        if (r < 0 || r > 8 || c < 0 || c > 8) continue;
        if (board[r][c]?.type === 'king') continue;
        board[r][c] = { type: 'quadraphage', owner: 'player2' };
      }
    }
    const trapped = { ...state, board };
    expect(getAIMove(trapped, 'player1', 'hard')).toBeNull();
    expect(getBestMove(trapped, 'player1')).toBeNull();
  });
});
