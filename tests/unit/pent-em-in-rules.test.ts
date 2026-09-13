import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import {
  getPieceCells,
  canPlacePiece,
  selectPiece,
  placePiece,
  canPlayerMove,
} from '../../src/games/pent-em-in/rules';

describe('Pent\'Em In – getPieceCells / canPlacePiece', () => {
  it('getPieceCells returns five cells for the X pentomino', () => {
    const cells = getPieceCells('X', { row: 2, col: 2 }, 0, false);
    expect(cells).toHaveLength(5);
    expect(cells).toEqual(
      expect.arrayContaining([
        { row: 2, col: 3 },
        { row: 3, col: 2 },
        { row: 3, col: 3 },
        { row: 3, col: 4 },
        { row: 4, col: 3 },
      ])
    );
  });

  it('getPieceCells returns [] for unknown shapes', () => {
    expect(getPieceCells('nope', { row: 0, col: 0 }, 0, false)).toEqual([]);
  });

  it('canPlacePiece is true on empty board and false out of bounds', () => {
    const state = createInitialState();
    expect(canPlacePiece(state, 'X', { row: 2, col: 2 }, 0, false)).toBe(true);
    // X extends +2 in row/col from anchor — (9,9) overflows 10×10
    expect(canPlacePiece(state, 'X', { row: 9, col: 9 }, 0, false)).toBe(false);
  });
});

describe('Pent\'Em In – selectPiece / placePiece / canPlayerMove', () => {
  it('selectPiece enters placePiece phase for available shapes', () => {
    const state = createInitialState();
    const next = selectPiece(state, 'I5');
    expect(next.selectedPiece).toBe('I5');
    expect(next.phase).toBe('placePiece');
    expect(next.selectedRotation).toBe(0);
  });

  it('selectPiece ignores shapes not in hand', () => {
    const state = createInitialState();
    expect(selectPiece(state, 'missing')).toBe(state);
  });

  it('placePiece occupies cells and removes the shape from the hand', () => {
    const state = createInitialState();
    const placed = placePiece(state, 'X', { row: 2, col: 2 }, 0, false);
    expect(placed.placedPieces).toHaveLength(1);
    expect(placed.player1Pieces.available).not.toContain('X');
    expect(placed.player1Pieces.placed).toContain('X');
    expect(placed.board[3][3].occupied).toBe(true);
    expect(placed.board[3][3].owner).toBe('player1');
    expect(placed.moveHistory).toHaveLength(1);
    if (placed.phase !== 'gameOver') {
      expect(placed.currentPlayer).toBe('player2');
    }
  });

  it('placePiece is a no-op when overlapping an existing piece', () => {
    let state = createInitialState();
    state = placePiece(state, 'X', { row: 2, col: 2 }, 0, false);
    // Force player1 turn again for overlap check
    state = { ...state, currentPlayer: 'player1', phase: 'selectPiece' };
    const blocked = placePiece(state, 'V', { row: 2, col: 2 }, 0, false);
    expect(blocked).toBe(state);
  });

  it('canPlayerMove is true on an empty board', () => {
    const state = createInitialState();
    expect(canPlayerMove(state, 'player1')).toBe(true);
    expect(canPlayerMove(state, 'player2')).toBe(true);
  });
});
