import { describe, it, expect } from 'vitest';
import {
  createInitialBoard,
  createInitialGameState,
  BOARD_SIZE,
  PLAYER1_KING_START,
  PLAYER2_KING_START,
  isValidPosition,
  getPiece,
  isEmpty,
  getSupply,
  hasSupply,
  fromOneBasedPosition,
  toOneBasedPosition,
} from '../../src/games/kings-quadraphages/board';
import { INITIAL_QUADRAPHAGE_COUNT } from '../../src/games/kings-quadraphages/pieces';

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

    it('has player1 king at top center (row 1, col 5)', () => {
      const board = createInitialBoard();
      const player1King = getPiece(board, PLAYER1_KING_START);

      expect(player1King).not.toBeNull();
      expect(player1King?.type).toBe('king');
      expect(player1King?.owner).toBe('player1');
    });

    it('has player2 king at bottom center (row 9, col 5)', () => {
      const board = createInitialBoard();
      const player2King = getPiece(board, PLAYER2_KING_START);

      expect(player2King).not.toBeNull();
      expect(player2King?.type).toBe('king');
      expect(player2King?.owner).toBe('player2');
    });

    it('has all other cells empty (79 cells)', () => {
      const board = createInitialBoard();
      let emptyCount = 0;

      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const isKingPosition =
            (row === PLAYER1_KING_START.row && col === PLAYER1_KING_START.col) ||
            (row === PLAYER2_KING_START.row && col === PLAYER2_KING_START.col);

          if (!isKingPosition) {
            expect(board[row][col]).toBeNull();
            emptyCount++;
          }
        }
      }

      expect(emptyCount).toBe(79); // 81 - 2 kings
    });
  });

  describe('createInitialGameState', () => {
    it('returns a game state with board and supplies', () => {
      const state = createInitialGameState();

      expect(state.board).toBeDefined();
      expect(state.player1Supply).toBeDefined();
      expect(state.player2Supply).toBeDefined();
    });

    it('initializes both supplies to 30', () => {
      const state = createInitialGameState();

      expect(state.player1Supply).toBe(INITIAL_QUADRAPHAGE_COUNT);
      expect(state.player2Supply).toBe(INITIAL_QUADRAPHAGE_COUNT);
      expect(INITIAL_QUADRAPHAGE_COUNT).toBe(30);
    });

    it('places kings at correct starting positions', () => {
      const state = createInitialGameState();

      const player1King = getPiece(state.board, PLAYER1_KING_START);
      const player2King = getPiece(state.board, PLAYER2_KING_START);

      expect(player1King?.type).toBe('king');
      expect(player1King?.owner).toBe('player1');
      expect(player2King?.type).toBe('king');
      expect(player2King?.owner).toBe('player2');
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

      expect(isEmpty(board, PLAYER1_KING_START)).toBe(false);
      expect(isEmpty(board, PLAYER2_KING_START)).toBe(false);
    });

    it('returns false for invalid positions', () => {
      const board = createInitialBoard();

      expect(isEmpty(board, { row: -1, col: 0 })).toBe(false);
      expect(isEmpty(board, { row: 9, col: 9 })).toBe(false);
    });
  });

  describe('getSupply', () => {
    it('returns correct supply for player1', () => {
      const state = createInitialGameState();

      expect(getSupply(state, 'player1')).toBe(30);
    });

    it('returns correct supply for player2', () => {
      const state = createInitialGameState();

      expect(getSupply(state, 'player2')).toBe(30);
    });
  });

  describe('hasSupply', () => {
    it('returns true when player has supply', () => {
      const state = createInitialGameState();

      expect(hasSupply(state, 'player1')).toBe(true);
      expect(hasSupply(state, 'player2')).toBe(true);
    });

    it('returns false when player has no supply', () => {
      const state = createInitialGameState();
      state.player1Supply = 0;

      expect(hasSupply(state, 'player1')).toBe(false);
      expect(hasSupply(state, 'player2')).toBe(true);
    });
  });

  describe('position conversion', () => {
    it('converts 1-based to 0-based position', () => {
      // Row 1, Col 5 (1-based) -> row 0, col 4 (0-based)
      const pos = fromOneBasedPosition(1, 5);
      expect(pos.row).toBe(0);
      expect(pos.col).toBe(4);
    });

    it('converts 0-based to 1-based position', () => {
      // row 0, col 4 (0-based) -> Row 1, Col 5 (1-based)
      const pos = toOneBasedPosition({ row: 0, col: 4 });
      expect(pos.row).toBe(1);
      expect(pos.col).toBe(5);
    });

    it('king starting positions match 1-based description', () => {
      // Player 1: Row 1, Col 5
      const p1 = toOneBasedPosition(PLAYER1_KING_START);
      expect(p1.row).toBe(1);
      expect(p1.col).toBe(5);

      // Player 2: Row 9, Col 5
      const p2 = toOneBasedPosition(PLAYER2_KING_START);
      expect(p2.row).toBe(9);
      expect(p2.col).toBe(5);
    });
  });
});
