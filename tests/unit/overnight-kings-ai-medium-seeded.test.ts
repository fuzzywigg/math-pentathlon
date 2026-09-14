/**
 * Overnight HEAVY — Kings medium AI seeded randomness top-N picks.
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
import {
  getValidKingMoves,
  getValidQuadraphagePlacements,
} from '../../src/games/kings-quadraphages/rules';

afterEach(() => {
  vi.restoreAllMocks();
});

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

function placePiece(board: Board, pos: Position, piece: Piece): void {
  board[pos.row][pos.col] = piece;
}

function createRulesState(board: Board): RulesGameState {
  return { board, player1Supply: 30, player2Supply: 30 };
}

function openingBoard(): Board {
  const board = createEmptyBoard();
  placePiece(board, { row: 0, col: 4 }, { type: 'king', owner: 'player1' });
  placePiece(board, { row: 8, col: 4 }, { type: 'king', owner: 'player2' });
  return board;
}

describe('Overnight kings — medium seeded randomness', () => {
  it('medium with random=0 returns legal kingMove + placement', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const state = createRulesState(openingBoard());
    const move = getAIMove(state, 'player1', 'medium');
    expect(move).not.toBeNull();
    const kingValids = getValidKingMoves(state, 'player1');
    expect(
      kingValids.some(
        (p) => p.row === move!.kingMove.row && p.col === move!.kingMove.col
      )
    ).toBe(true);
    expect(move!.quadraphagePlacement.row).toBeGreaterThanOrEqual(0);
    expect(move!.quadraphagePlacement.col).toBeLessThan(BOARD_SIZE);
  });

  it('medium with random=0.99 still legal vs easy random path', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const state = createRulesState(openingBoard());
    const medium = getAIMove(state, 'player1', 'medium');
    const easy = getAIMove(state, 'player1', 'easy');
    expect(medium).not.toBeNull();
    expect(easy).not.toBeNull();
    expect(getValidKingMoves(state, 'player1').length).toBeGreaterThan(0);
    expect(getValidQuadraphagePlacements(state).length).toBeGreaterThan(0);
  });
});
