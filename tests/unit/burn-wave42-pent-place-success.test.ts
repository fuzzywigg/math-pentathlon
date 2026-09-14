/**
 * Wave 42 — Pent'Em In placePiece success board/available/seat updates leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import {
  placePiece,
  getPieceCells,
  selectPiece,
} from '../../src/games/pent-em-in/rules';

describe('Wave 42 pent-em-in — placePiece success updates', () => {
  it('marks board cells with owner and pieceId', () => {
    const state = createInitialState();
    const next = placePiece(state, 'X', { row: 2, col: 2 }, 0, false);
    const cells = getPieceCells('X', { row: 2, col: 2 }, 0, false);
    for (const cell of cells) {
      const boardCell = next.board[cell.row][cell.col];
      expect(boardCell.occupied).toBe(true);
      expect(boardCell.owner).toBe('player1');
      expect(boardCell.pieceId).toBe('player1-X-0');
    }
  });

  it('removes shape from available, adds to placed, flips seat', () => {
    const state = createInitialState();
    const next = placePiece(state, 'F', { row: 1, col: 1 }, 0, false);
    expect(next.player1Pieces.available).not.toContain('F');
    expect(next.player1Pieces.placed).toContain('F');
    expect(next.player2Pieces.available).toContain('F');
    expect(next.currentPlayer).toBe('player2');
  });

  it('clears selection state and records move history', () => {
    let state = createInitialState();
    state = selectPiece(state, 'V');
    state = {
      ...state,
      selectedRotation: 90,
      selectedFlipped: true,
      previewPosition: { row: 3, col: 3 },
    };
    const next = placePiece(state, 'V', { row: 3, col: 3 }, 90, true);
    expect(next.selectedPiece).toBeNull();
    expect(next.selectedRotation).toBe(0);
    expect(next.selectedFlipped).toBe(false);
    expect(next.previewPosition).toBeNull();
    expect(next.moveHistory).toHaveLength(1);
    expect(next.moveHistory[0]).toMatchObject({
      player: 'player1',
      shapeId: 'V',
      moveNumber: 1,
    });
    expect(next.placedPieces).toHaveLength(1);
  });
});
