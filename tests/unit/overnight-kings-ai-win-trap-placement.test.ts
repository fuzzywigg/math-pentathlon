/**
 * Overnight HEAVY — Kings AI win-trap placement (+10000 deny/block).
 * Distinct leftover vs wave42 difficulty opening coverage.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  getAIMove,
  getBestMove,
} from '../../src/games/kings-quadraphages/ai';
import {
  Board,
  BOARD_SIZE,
  RulesGameState,
  Position,
} from '../../src/games/kings-quadraphages/board';
import { Piece } from '../../src/games/kings-quadraphages/pieces';
import { getValidKingMoves } from '../../src/games/kings-quadraphages/rules';
import {
  createEmptyBoard,
  placePiece,
  createCustomGameState,
} from './helpers/kings-board';

/**
 * P2 king in corner with a single escape at (1,1).
 * P1 can move then place on that escape for a guaranteed trap.
 */
function winTrapBoard(): Board {
  const board = createEmptyBoard();
  placePiece(board, { row: 4, col: 4 }, { type: 'king', owner: 'player1' });
  placePiece(board, { row: 0, col: 0 }, { type: 'king', owner: 'player2' });
  placePiece(
    board,
    { row: 0, col: 1 },
    { type: 'quadraphage', owner: 'player1' }
  );
  placePiece(
    board,
    { row: 1, col: 0 },
    { type: 'quadraphage', owner: 'player1' }
  );
  // (1,1) left empty — the only escape for P2
  return board;
}

describe('Overnight kings — win-trap placement', () => {
  it('hard prefers placing on opponent last escape cell', () => {
    const board = winTrapBoard();
    const state = createCustomGameState(board);
    expect(getValidKingMoves(state, 'player2')).toEqual([{ row: 1, col: 1 }]);

    const move = getAIMove(state, 'player1', 'hard');
    expect(move).not.toBeNull();
    expect(move!.quadraphagePlacement).toEqual({ row: 1, col: 1 });
  });

  it('getBestMove also selects the trapping placement', () => {
    const move = getBestMove(createCustomGameState(winTrapBoard()), 'player1');
    expect(move).not.toBeNull();
    expect(move!.quadraphagePlacement).toEqual({ row: 1, col: 1 });
  });
});
