import { describe, it, expect } from 'vitest';
import {
  createInitialBoard,
  BOARD_SIZE,
  BLUE_KING_START,
  RED_KING_START,
  isValidPosition,
  getPiece,
  isEmpty,
} from '../../src/games/kings-quadraphages/board';

describe('Board', () => {
  describe('createInitialBoard', () => {
    it('returns a 9x9 grid', () => {
      const board = createInitialBoard();

      expect(board.length).toBe(BOARD_SIZE);
      board.forEach((row) => {
        expect(row.length).toBe(BOARD_SIZE);
      });
    });

    it('has 81 total cells', () => {
      const board = createInitialBoard();
      const totalCells = board.flat().length;

      expect(totalCells).toBe(81);
    });

    it('has blue king at top center', () => {
      const board = createInitialBoard();
      const blueKing = getPiece(board, BLUE_KING_START);

      expect(blueKing).not.toBeNull();
      expect(blueKing?.type).toBe('king');
      expect(blueKing?.owner).toBe('blue');
    });

    it('has red king at bottom center', () => {
      const board = createInitialBoard();
      const redKing = getPiece(board, RED_KING_START);

      expect(redKing).not.toBeNull();
      expect(redKing?.type).toBe('king');
      expect(redKing?.owner).toBe('red');
    });

    it('has all other cells empty', () => {
      const board = createInitialBoard();
      let emptyCount = 0;

      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const isKingPosition =
            (row === BLUE_KING_START.row && col === BLUE_KING_START.col) ||
            (row === RED_KING_START.row && col === RED_KING_START.col);

          if (!isKingPosition) {
            expect(board[row][col]).toBeNull();
            emptyCount++;
          }
        }
      }

      expect(emptyCount).toBe(79); // 81 - 2 kings
    });
  });

  describe('isValidPosition', () => {
    it('returns true for valid positions', () => {
      expect(isValidPosition({ row: 0, col: 0 })).toBe(true);
      expect(isValidPosition({ row: 4, col: 4 })).toBe(true);
      expect(isValidPosition({ row: 8, col: 8 })).toBe(true);
    });

    it('returns false for positions outside the board', () => {
      expect(isValidPosition({ row: -1, col: 0 })).toBe(false);
      expect(isValidPosition({ row: 0, col: -1 })).toBe(false);
      expect(isValidPosition({ row: 9, col: 0 })).toBe(false);
      expect(isValidPosition({ row: 0, col: 9 })).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('returns true for empty cells', () => {
      const board = createInitialBoard();

      expect(isEmpty(board, { row: 0, col: 0 })).toBe(true);
      expect(isEmpty(board, { row: 4, col: 4 })).toBe(true);
    });

    it('returns false for cells with pieces', () => {
      const board = createInitialBoard();

      expect(isEmpty(board, BLUE_KING_START)).toBe(false);
      expect(isEmpty(board, RED_KING_START)).toBe(false);
    });

    it('returns false for invalid positions', () => {
      const board = createInitialBoard();

      expect(isEmpty(board, { row: -1, col: 0 })).toBe(false);
      expect(isEmpty(board, { row: 9, col: 9 })).toBe(false);
    });
  });
});
