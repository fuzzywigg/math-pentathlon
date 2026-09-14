/**
 * Wave 42 — Kings getOpponent + endTurn win/draw branches. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { getOpponent, findKingPosition } from '../../src/games/kings-quadraphages/rules';
import {
  createInitialGameState,
  moveKing,
  placeQuadraphage,
  endTurn,
  type GameState,
} from '../../src/games/kings-quadraphages/game-state';

function trap(state: GameState, victim: 'player1' | 'player2'): GameState {
  const board = state.board.map((row) => row.map((c) => (c ? { ...c } : null)));
  const king = findKingPosition(board, victim)!;
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
  return { ...state, board };
}

describe('Wave 42 kings — endTurn branches', () => {
  it('opponent helper + normal endTurn flips', () => {
    expect(getOpponent('player1')).toBe('player2');
    let s = createInitialGameState();
    s = moveKing(s, { row: 2, col: 5 });
    s = placeQuadraphage(s, { row: 3, col: 3 });
    expect(s.currentPlayer).toBe('player2');
  });

  it('endTurn with trapped opponent → gameOver', () => {
    let s = createInitialGameState();
    s = moveKing(s, { row: 2, col: 5 });
    // place then manually trap p2 before endTurn is internal — inject via place then trap
    s = placeQuadraphage(s, { row: 4, col: 4 });
    const trapped = trap(s, 'player2');
    const over = endTurn({ ...trapped, turnPhase: 'placeQuadraphage' });
    expect(over.turnPhase).toBe('gameOver');
    expect(over.winner).toBe('player1');
  });
});
