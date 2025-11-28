import { describe, it, expect } from 'vitest';
import {
  createInitialGameState,
  moveKing,
  placeQuadraphage,
  selectKing,
  resetGame,
  getKingPosition,
  getSupply,
  getCurrentPhaseMessage,
  isValidMove,
  isValidPlacement,
  GameState,
  Position,
} from '../../src/games/kings-quadraphages/game-state';

describe('Game State', () => {
  // ============================================
  // INITIALIZATION TESTS
  // ============================================
  describe('createInitialGameState', () => {
    it('returns correct initial setup', () => {
      const state = createInitialGameState();

      // Check board dimensions
      expect(state.board.length).toBe(9);
      expect(state.board[0].length).toBe(9);

      // Check Player 1 King position (row 1, col 5 = index [0][4])
      expect(state.board[0][4]).toEqual({ type: 'king', owner: 'player1' });

      // Check Player 2 King position (row 9, col 5 = index [8][4])
      expect(state.board[8][4]).toEqual({ type: 'king', owner: 'player2' });

      // Check initial game state
      expect(state.currentPlayer).toBe('player1');
      expect(state.turnPhase).toBe('moveKing');
      expect(state.player1Supply).toBe(30);
      expect(state.player2Supply).toBe(30);
      expect(state.selectedKingPosition).toBeNull();
      expect(state.winner).toBeNull();
      expect(state.moveHistory).toEqual([]);
    });

    it('has exactly 2 pieces on the board initially', () => {
      const state = createInitialGameState();
      let pieceCount = 0;

      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (state.board[row][col] !== null) {
            pieceCount++;
          }
        }
      }

      expect(pieceCount).toBe(2);
    });
  });

  // ============================================
  // KING MOVEMENT TESTS
  // ============================================
  describe('moveKing', () => {
    it('updates board and changes phase to placeQuadraphage', () => {
      const state = createInitialGameState();

      // Move Player 1 King from (1,5) to (2,5) [1-based]
      const newState = moveKing(state, { row: 2, col: 5 });

      // Old position should be empty (index [0][4])
      expect(newState.board[0][4]).toBeNull();

      // New position should have the king (index [1][4])
      expect(newState.board[1][4]).toEqual({ type: 'king', owner: 'player1' });

      // Phase should change
      expect(newState.turnPhase).toBe('placeQuadraphage');

      // Move history should be updated
      expect(newState.moveHistory.length).toBe(1);
      expect(newState.moveHistory[0]).toEqual({
        player: 'player1',
        action: 'moveKing',
        from: { row: 1, col: 5 },
        to: { row: 2, col: 5 },
      });
    });

    it('returns unchanged state for invalid destination', () => {
      const state = createInitialGameState();

      // Try to move King to an invalid position (too far)
      const newState = moveKing(state, { row: 3, col: 5 });

      // State should be unchanged
      expect(newState).toBe(state);
      expect(newState.board[0][4]).toEqual({ type: 'king', owner: 'player1' });
      expect(newState.turnPhase).toBe('moveKing');
    });

    it('returns unchanged state if not in moveKing phase', () => {
      let state = createInitialGameState();
      state = moveKing(state, { row: 2, col: 5 }); // Move king first

      // Now in placeQuadraphage phase
      const newState = moveKing(state, { row: 3, col: 5 });

      // State should be unchanged
      expect(newState).toBe(state);
    });
  });

  // ============================================
  // QUADRAPHAGE PLACEMENT TESTS
  // ============================================
  describe('placeQuadraphage', () => {
    it('decrements supply correctly', () => {
      let state = createInitialGameState();
      state = moveKing(state, { row: 2, col: 5 }); // Move king first

      const newState = placeQuadraphage(state, { row: 5, col: 5 });

      expect(newState.player1Supply).toBe(29);
      expect(newState.player2Supply).toBe(30);
    });

    it('switches player after placement', () => {
      let state = createInitialGameState();
      state = moveKing(state, { row: 2, col: 5 });

      const newState = placeQuadraphage(state, { row: 5, col: 5 });

      expect(newState.currentPlayer).toBe('player2');
      expect(newState.turnPhase).toBe('moveKing');
    });

    it('places quadraphage on board', () => {
      let state = createInitialGameState();
      state = moveKing(state, { row: 2, col: 5 });

      const newState = placeQuadraphage(state, { row: 5, col: 5 });

      // Position (5,5) in 1-based = index [4][4]
      expect(newState.board[4][4]).toEqual({ type: 'quadraphage', owner: 'player1' });
    });

    it('returns unchanged state for invalid placement', () => {
      let state = createInitialGameState();
      state = moveKing(state, { row: 2, col: 5 });

      // Try to place on the king's new position
      const newState = placeQuadraphage(state, { row: 2, col: 5 });

      expect(newState).toBe(state);
    });

    it('returns unchanged state if not in placeQuadraphage phase', () => {
      const state = createInitialGameState();

      // Try to place without moving king first
      const newState = placeQuadraphage(state, { row: 5, col: 5 });

      expect(newState).toBe(state);
    });

    it('adds to move history', () => {
      let state = createInitialGameState();
      state = moveKing(state, { row: 2, col: 5 });

      const newState = placeQuadraphage(state, { row: 5, col: 5 });

      expect(newState.moveHistory.length).toBe(2);
      expect(newState.moveHistory[1]).toEqual({
        player: 'player1',
        action: 'placeQuadraphage',
        to: { row: 5, col: 5 },
      });
    });
  });

  // ============================================
  // WIN CONDITION TESTS
  // ============================================
  describe('endTurn and win detection', () => {
    it('detects winner when opponent is trapped', () => {
      let state = createInitialGameState();

      // Manually set up a trap scenario
      // Move Player 2 King to corner and surround it
      state.board[8][4] = null; // Remove Player 2 King from start
      state.board[0][0] = { type: 'king', owner: 'player2' }; // Place in corner

      // Place quadraphages to trap
      state.board[0][1] = { type: 'quadraphage', owner: 'player1' };
      state.board[1][0] = { type: 'quadraphage', owner: 'player1' };
      state.board[1][1] = { type: 'quadraphage', owner: 'player1' };

      // Set up state for Player 1's turn
      state.turnPhase = 'moveKing';
      state.currentPlayer = 'player1';

      // Move King (Player 1 king is at [0][4])
      state = moveKing(state, { row: 2, col: 5 });

      // Place quadraphage - this should trigger win check
      const finalState = placeQuadraphage(state, { row: 5, col: 5 });

      expect(finalState.winner).toBe('player1');
      expect(finalState.turnPhase).toBe('gameOver');
    });
  });

  // ============================================
  // RESET GAME TESTS
  // ============================================
  describe('resetGame', () => {
    it('returns fresh initial state', () => {
      let state = createInitialGameState();
      state = moveKing(state, { row: 2, col: 5 });
      state = placeQuadraphage(state, { row: 5, col: 5 });

      const freshState = resetGame();

      expect(freshState.currentPlayer).toBe('player1');
      expect(freshState.turnPhase).toBe('moveKing');
      expect(freshState.player1Supply).toBe(30);
      expect(freshState.moveHistory).toEqual([]);
      expect(freshState.board[0][4]).toEqual({ type: 'king', owner: 'player1' });
    });
  });

  // ============================================
  // HELPER FUNCTION TESTS
  // ============================================
  describe('getKingPosition', () => {
    it('finds correct positions for both players', () => {
      const state = createInitialGameState();

      const p1King = getKingPosition(state, 'player1');
      const p2King = getKingPosition(state, 'player2');

      expect(p1King).toEqual({ row: 1, col: 5 });
      expect(p2King).toEqual({ row: 9, col: 5 });
    });

    it('tracks king after movement', () => {
      let state = createInitialGameState();
      state = moveKing(state, { row: 2, col: 5 });

      const p1King = getKingPosition(state, 'player1');
      expect(p1King).toEqual({ row: 2, col: 5 });
    });
  });

  describe('getSupply', () => {
    it('returns correct supply for each player', () => {
      const state = createInitialGameState();

      expect(getSupply(state, 'player1')).toBe(30);
      expect(getSupply(state, 'player2')).toBe(30);
    });

    it('reflects supply changes', () => {
      let state = createInitialGameState();
      state = moveKing(state, { row: 2, col: 5 });
      state = placeQuadraphage(state, { row: 5, col: 5 });

      expect(getSupply(state, 'player1')).toBe(29);
      expect(getSupply(state, 'player2')).toBe(30);
    });
  });

  describe('getCurrentPhaseMessage', () => {
    it('returns correct strings for each phase', () => {
      let state = createInitialGameState();

      // moveKing phase for Player 1
      expect(getCurrentPhaseMessage(state)).toBe('Player 1: Move your King');

      // placeQuadraphage phase for Player 1
      state = moveKing(state, { row: 2, col: 5 });
      expect(getCurrentPhaseMessage(state)).toBe('Player 1: Place a Quadraphage');

      // moveKing phase for Player 2
      state = placeQuadraphage(state, { row: 5, col: 5 });
      expect(getCurrentPhaseMessage(state)).toBe('Player 2: Move your King');
    });

    it('returns game over message with winner', () => {
      let state = createInitialGameState();
      state.turnPhase = 'gameOver';
      state.winner = 'player1';

      expect(getCurrentPhaseMessage(state)).toBe('Game Over! Player 1 wins!');

      state.winner = 'player2';
      expect(getCurrentPhaseMessage(state)).toBe('Game Over! Player 2 wins!');
    });
  });

  // ============================================
  // IMMUTABILITY TESTS
  // ============================================
  describe('Immutability', () => {
    it('moveKing does not mutate original state', () => {
      const original = createInitialGameState();
      const originalBoard = JSON.stringify(original.board);
      const originalPhase = original.turnPhase;

      moveKing(original, { row: 2, col: 5 });

      expect(JSON.stringify(original.board)).toBe(originalBoard);
      expect(original.turnPhase).toBe(originalPhase);
    });

    it('placeQuadraphage does not mutate original state', () => {
      let state = createInitialGameState();
      state = moveKing(state, { row: 2, col: 5 });

      const originalSupply = state.player1Supply;
      const originalBoard = JSON.stringify(state.board);

      placeQuadraphage(state, { row: 5, col: 5 });

      expect(state.player1Supply).toBe(originalSupply);
      expect(JSON.stringify(state.board)).toBe(originalBoard);
    });

    it('selectKing does not mutate original state', () => {
      const original = createInitialGameState();
      const originalSelected = original.selectedKingPosition;

      selectKing(original);

      expect(original.selectedKingPosition).toBe(originalSelected);
    });
  });

  // ============================================
  // SELECT KING TESTS
  // ============================================
  describe('selectKing', () => {
    it('sets selectedKingPosition to current player king position', () => {
      const state = createInitialGameState();

      const newState = selectKing(state);

      expect(newState.selectedKingPosition).toEqual({ row: 1, col: 5 });
    });

    it('returns unchanged state if not in moveKing phase', () => {
      let state = createInitialGameState();
      state = moveKing(state, { row: 2, col: 5 });

      const newState = selectKing(state);

      expect(newState).toBe(state);
    });
  });

  // ============================================
  // VALIDATION HELPER TESTS
  // ============================================
  describe('isValidMove', () => {
    it('returns true for valid king moves', () => {
      const state = createInitialGameState();

      expect(isValidMove(state, { row: 2, col: 5 })).toBe(true);
      expect(isValidMove(state, { row: 1, col: 4 })).toBe(true);
      expect(isValidMove(state, { row: 2, col: 6 })).toBe(true);
    });

    it('returns false for invalid moves', () => {
      const state = createInitialGameState();

      expect(isValidMove(state, { row: 3, col: 5 })).toBe(false); // Too far
      expect(isValidMove(state, { row: 0, col: 5 })).toBe(false); // Off board
    });
  });

  describe('isValidPlacement', () => {
    it('returns true for valid placements in correct phase', () => {
      let state = createInitialGameState();
      state = moveKing(state, { row: 2, col: 5 });

      expect(isValidPlacement(state, { row: 5, col: 5 })).toBe(true);
    });

    it('returns false if not in placeQuadraphage phase', () => {
      const state = createInitialGameState();

      expect(isValidPlacement(state, { row: 5, col: 5 })).toBe(false);
    });

    it('returns false for occupied cells', () => {
      let state = createInitialGameState();
      state = moveKing(state, { row: 2, col: 5 });

      // Try to place on king position
      expect(isValidPlacement(state, { row: 2, col: 5 })).toBe(false);
    });
  });
});
