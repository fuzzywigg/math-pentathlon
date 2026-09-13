import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  getAIMove,
  isAITurn,
  getRandomMove,
} from '../../src/games/kings-quadraphages/ai';
import { createInitialGameState } from '../../src/games/kings-quadraphages/game-state';
import {
  Board,
  BOARD_SIZE,
  RulesGameState,
  Position,
} from '../../src/games/kings-quadraphages/board';
import { Piece } from '../../src/games/kings-quadraphages/pieces';

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

describe('Kings & Quadraphages — modern AI API', () => {
  it('isAITurn gates on mode, seat, and game over', () => {
    const state = createInitialGameState();
    expect(isAITurn(state, 'player2', 'human-vs-human')).toBe(false);
    expect(isAITurn(state, null, 'human-vs-ai')).toBe(false);
    expect(isAITurn(state, 'player2', 'human-vs-ai')).toBe(false);
    expect(
      isAITurn(
        { ...state, currentPlayer: 'player2' },
        'player2',
        'human-vs-ai'
      )
    ).toBe(true);
    expect(
      isAITurn(
        { ...state, turnPhase: 'gameOver', winner: 'player1' },
        'player1',
        'human-vs-ai'
      )
    ).toBe(false);
  });

  it('getAIMove easy returns king move + quad placement on opening', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.25);
    const board = createEmptyBoard();
    placePiece(board, { row: 0, col: 4 }, { type: 'king', owner: 'player1' });
    placePiece(board, { row: 8, col: 4 }, { type: 'king', owner: 'player2' });
    const move = getAIMove(createRulesState(board), 'player1', 'easy');
    expect(move).not.toBeNull();
    expect(move!.kingMove.row).toBeGreaterThanOrEqual(0);
    expect(move!.quadraphagePlacement.col).toBeLessThan(BOARD_SIZE);
  });

  it('getAIMove medium returns a move for player2', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const board = createEmptyBoard();
    placePiece(board, { row: 0, col: 4 }, { type: 'king', owner: 'player1' });
    placePiece(board, { row: 8, col: 4 }, { type: 'king', owner: 'player2' });
    const move = getAIMove(createRulesState(board), 'player2', 'medium');
    expect(move).not.toBeNull();
    expect(move!.kingMove).toBeDefined();
    expect(move!.quadraphagePlacement).toBeDefined();
  });

  it('getAIMove returns null when the AI king is trapped', () => {
    const board = createEmptyBoard();
    placePiece(board, { row: 4, col: 4 }, { type: 'king', owner: 'player1' });
    placePiece(board, { row: 0, col: 0 }, { type: 'king', owner: 'player2' });
    placePiece(board, { row: 0, col: 1 }, { type: 'quadraphage', owner: 'player1' });
    placePiece(board, { row: 1, col: 0 }, { type: 'quadraphage', owner: 'player1' });
    placePiece(board, { row: 1, col: 1 }, { type: 'quadraphage', owner: 'player1' });
    expect(getAIMove(createRulesState(board), 'player2', 'easy')).toBeNull();
  });

  it('getRandomMove aliases easy difficulty', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const board = createEmptyBoard();
    placePiece(board, { row: 0, col: 4 }, { type: 'king', owner: 'player1' });
    placePiece(board, { row: 8, col: 4 }, { type: 'king', owner: 'player2' });
    const move = getRandomMove(createRulesState(board), 'player1');
    expect(move).not.toBeNull();
  });
});
