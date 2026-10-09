/**
 * Overnight HEAVY after #210 — Kings medium also takes win-trap placement.
 * #210 win-trap only asserted hard + getBestMove.
 * Tests-only.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { getAIMove } from '../../src/games/kings-quadraphages/ai';
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

afterEach(() => {
  vi.restoreAllMocks();
});

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
  return board;
}

describe('Overnight kings — medium win-trap', () => {
  it('medium getAIMove places on opponent last escape cell', () => {
    const board = winTrapBoard();
    const state = createCustomGameState(board);
    expect(getValidKingMoves(state, 'player2')).toEqual([{ row: 1, col: 1 }]);

    // Seed placement pick toward top of scored list (trap dominates with +10000)
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    expect(move!.quadraphagePlacement).toEqual({ row: 1, col: 1 });
  });
});
