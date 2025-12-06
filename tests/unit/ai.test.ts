import { describe, it, expect } from 'vitest';
import {
  getBestMove,
  getRandomMove,
  evaluatePosition,
  AIDifficulty,
} from '../../src/games/kings-quadraphages/ai';
import {
  Board,
  BOARD_SIZE,
  RulesGameState,
  Position,
} from '../../src/games/kings-quadraphages/board';
import { Piece } from '../../src/games/kings-quadraphages/pieces';

// Helper to create an empty board
function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

// Helper to create a game state with custom board
function createCustomGameState(
  board: Board,
  player1Supply = 30,
  player2Supply = 30
): RulesGameState {
  return {
    board,
    player1Supply,
    player2Supply,
  };
}

// Helper to place a piece on the board
function placePiece(board: Board, pos: Position, piece: Piece): void {
  board[pos.row][pos.col] = piece;
}

// Helper to place a King
function placeKing(board: Board, pos: Position, owner: 'player1' | 'player2'): void {
  placePiece(board, pos, { type: 'king', owner });
}

// Helper to place a Quadraphage
function placeQuadraphage(board: Board, pos: Position, owner: 'player1' | 'player2'): void {
  placePiece(board, pos, { type: 'quadraphage', owner });
}

describe('AI', () => {
  describe('getBestMove', () => {
    it('returns a valid move for the AI player', () => {
      const board = createEmptyBoard();
      placeKing(board, { row: 0, col: 4 }, 'player1');
      placeKing(board, { row: 8, col: 4 }, 'player2');
      const state = createCustomGameState(board);

      const move = getBestMove(state, 'player2', 'easy');

      expect(move).not.toBeNull();
      expect(move!.kingMove).toBeDefined();
      expect(move!.quadraphagePlacement).toBeDefined();
    });

    it('returns null when AI is trapped', () => {
      const board = createEmptyBoard();
      placeKing(board, { row: 4, col: 4 }, 'player1');
      placeKing(board, { row: 0, col: 0 }, 'player2'); // Corner
      // Trap player2
      placeQuadraphage(board, { row: 0, col: 1 }, 'player1');
      placeQuadraphage(board, { row: 1, col: 0 }, 'player1');
      placeQuadraphage(board, { row: 1, col: 1 }, 'player1');
      const state = createCustomGameState(board);

      const move = getBestMove(state, 'player2', 'medium');

      expect(move).toBeNull();
    });

    it('AI finds winning move when available', () => {
      const board = createEmptyBoard();
      placeKing(board, { row: 4, col: 4 }, 'player1');
      placeKing(board, { row: 0, col: 0 }, 'player2'); // Corner
      // Partially trap player1 - only one escape at (5,5)
      placeQuadraphage(board, { row: 3, col: 3 }, 'player2');
      placeQuadraphage(board, { row: 3, col: 4 }, 'player2');
      placeQuadraphage(board, { row: 3, col: 5 }, 'player2');
      placeQuadraphage(board, { row: 4, col: 3 }, 'player2');
      placeQuadraphage(board, { row: 4, col: 5 }, 'player2');
      placeQuadraphage(board, { row: 5, col: 3 }, 'player2');
      placeQuadraphage(board, { row: 5, col: 4 }, 'player2');
      const state = createCustomGameState(board);

      // Use medium difficulty for faster test
      const move = getBestMove(state, 'player2', 'medium');

      expect(move).not.toBeNull();
      // The AI should place quadraphage at (5,5) to trap player1
      expect(move!.quadraphagePlacement).toEqual({ row: 5, col: 5 });
    });

    it('works with all difficulty levels', () => {
      // Use a more constrained board to speed up search
      const board = createEmptyBoard();
      placeKing(board, { row: 0, col: 4 }, 'player1');
      placeKing(board, { row: 8, col: 4 }, 'player2');
      // Add some blockers to constrain the search space
      for (let i = 0; i < 9; i++) {
        placeQuadraphage(board, { row: 4, col: i }, 'player1');
      }
      const state = createCustomGameState(board);

      const difficulties: AIDifficulty[] = ['easy', 'medium', 'hard'];

      for (const difficulty of difficulties) {
        const move = getBestMove(state, 'player2', difficulty);
        expect(move).not.toBeNull();
        expect(move!.kingMove).toBeDefined();
        expect(move!.quadraphagePlacement).toBeDefined();
      }
    });
  });

  describe('getRandomMove', () => {
    it('returns a valid random move', () => {
      const board = createEmptyBoard();
      placeKing(board, { row: 0, col: 4 }, 'player1');
      placeKing(board, { row: 8, col: 4 }, 'player2');
      const state = createCustomGameState(board);

      const move = getRandomMove(state, 'player2');

      expect(move).not.toBeNull();
      expect(move!.kingMove).toBeDefined();
      expect(move!.quadraphagePlacement).toBeDefined();
    });

    it('returns null when player is trapped', () => {
      const board = createEmptyBoard();
      placeKing(board, { row: 4, col: 4 }, 'player1');
      placeKing(board, { row: 0, col: 0 }, 'player2');
      placeQuadraphage(board, { row: 0, col: 1 }, 'player1');
      placeQuadraphage(board, { row: 1, col: 0 }, 'player1');
      placeQuadraphage(board, { row: 1, col: 1 }, 'player1');
      const state = createCustomGameState(board);

      const move = getRandomMove(state, 'player2');

      expect(move).toBeNull();
    });
  });

  describe('evaluatePosition', () => {
    it('returns high score when opponent is trapped', () => {
      const board = createEmptyBoard();
      placeKing(board, { row: 4, col: 4 }, 'player1');
      placeKing(board, { row: 0, col: 0 }, 'player2');
      placeQuadraphage(board, { row: 0, col: 1 }, 'player1');
      placeQuadraphage(board, { row: 1, col: 0 }, 'player1');
      placeQuadraphage(board, { row: 1, col: 1 }, 'player1');
      const state = createCustomGameState(board);

      const score = evaluatePosition(state, 'player1');

      expect(score).toBe(10000); // Win condition
    });

    it('returns low score when we are trapped', () => {
      const board = createEmptyBoard();
      placeKing(board, { row: 4, col: 4 }, 'player1');
      placeKing(board, { row: 0, col: 0 }, 'player2');
      placeQuadraphage(board, { row: 0, col: 1 }, 'player1');
      placeQuadraphage(board, { row: 1, col: 0 }, 'player1');
      placeQuadraphage(board, { row: 1, col: 1 }, 'player1');
      const state = createCustomGameState(board);

      const score = evaluatePosition(state, 'player2');

      expect(score).toBe(-10000); // Loss condition
    });

    it('prefers center positions over corners', () => {
      const boardCenter = createEmptyBoard();
      placeKing(boardCenter, { row: 4, col: 4 }, 'player1'); // Center
      placeKing(boardCenter, { row: 0, col: 0 }, 'player2'); // Corner
      const stateCenter = createCustomGameState(boardCenter);

      const boardCorner = createEmptyBoard();
      placeKing(boardCorner, { row: 0, col: 0 }, 'player1'); // Corner
      placeKing(boardCorner, { row: 4, col: 4 }, 'player2'); // Center
      const stateCorner = createCustomGameState(boardCorner);

      const scoreCenter = evaluatePosition(stateCenter, 'player1');
      const scoreCorner = evaluatePosition(stateCorner, 'player1');

      expect(scoreCenter).toBeGreaterThan(scoreCorner);
    });

    it('values higher mobility', () => {
      // Player with 8 moves vs player with 3 moves
      const board1 = createEmptyBoard();
      placeKing(board1, { row: 4, col: 4 }, 'player1'); // Center (8 moves)
      placeKing(board1, { row: 0, col: 0 }, 'player2'); // Corner (3 moves)
      const state1 = createCustomGameState(board1);

      const board2 = createEmptyBoard();
      placeKing(board2, { row: 0, col: 0 }, 'player1'); // Corner (3 moves)
      placeKing(board2, { row: 4, col: 4 }, 'player2'); // Center (8 moves)
      const state2 = createCustomGameState(board2);

      const score1 = evaluatePosition(state1, 'player1');
      const score2 = evaluatePosition(state2, 'player1');

      expect(score1).toBeGreaterThan(score2);
    });
  });
});
