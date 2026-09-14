/**
 * Wave 42 — Kings valid king moves 8-dir + occupied reject. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getValidKingMoves,
  isValidKingMove,
  findKingPosition,
} from '../../src/games/kings-quadraphages/rules';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';

describe('Wave 42 kings — king direction matrix', () => {
  it('opening p1 has 5 forward-ish moves (edge row)', () => {
    const s = createInitialGameState();
    const moves = getValidKingMoves(s, 'player1');
    expect(moves.length).toBe(5);
    const king = findKingPosition(s.board, 'player1')!;
    expect(king).toEqual({ row: 0, col: 4 });
    for (const m of moves) {
      expect(isValidKingMove(s, 'player1', m)).toBe(true);
    }
  });

  it('cannot move onto other king or stay put', () => {
    const s = createInitialGameState();
    const p2 = findKingPosition(s.board, 'player2')!;
    expect(isValidKingMove(s, 'player1', p2)).toBe(false);
    expect(isValidKingMove(s, 'player1', { row: 0, col: 4 })).toBe(false);
    expect(isValidKingMove(s, 'player1', { row: 3, col: 4 })).toBe(false); // 3 away
  });

  it('center king has 8 empties', () => {
    const s = createInitialGameState();
    const board = s.board.map((r) => r.map((c) => (c ? { ...c } : null)));
    board[0][4] = null;
    board[4][4] = { type: 'king', owner: 'player1' };
    const mid = { ...s, board };
    expect(getValidKingMoves(mid, 'player1')).toHaveLength(8);
  });
});
