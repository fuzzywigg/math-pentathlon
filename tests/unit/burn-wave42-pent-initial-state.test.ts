/**
 * Wave 42 — Pent'Em In createInitialState / BOARD_SIZE / PIECES_PER_PLAYER leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  BOARD_SIZE,
  PIECES_PER_PLAYER,
} from '../../src/games/pent-em-in/types';
import { PENTOMINOES } from '../../src/core/polyomino/types';

const EXPECTED_SHAPE_IDS = [
  'F',
  'I5',
  'L5',
  'N',
  'P',
  'T5',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z5',
];

describe('Wave 42 pent-em-in — initial state constants', () => {
  it('BOARD_SIZE is 10 and PIECES_PER_PLAYER is 12', () => {
    expect(BOARD_SIZE).toBe(10);
    expect(PIECES_PER_PLAYER).toBe(12);
    expect(PENTOMINOES).toHaveLength(12);
  });

  it('createInitialState builds empty 10×10 board', () => {
    const state = createInitialState();
    expect(state.board).toHaveLength(BOARD_SIZE);
    for (const row of state.board) {
      expect(row).toHaveLength(BOARD_SIZE);
      for (const cell of row) {
        expect(cell.occupied).toBe(false);
        expect(cell.owner).toBeNull();
        expect(cell.pieceId).toBeNull();
      }
    }
  });

  it('each seat starts with all 12 pentomino shape ids available', () => {
    const state = createInitialState();
    expect(state.player1Pieces.available).toHaveLength(PIECES_PER_PLAYER);
    expect(state.player2Pieces.available).toHaveLength(PIECES_PER_PLAYER);
    expect(state.player1Pieces.placed).toEqual([]);
    expect(state.player2Pieces.placed).toEqual([]);

    for (const id of EXPECTED_SHAPE_IDS) {
      expect(state.player1Pieces.available).toContain(id);
      expect(state.player2Pieces.available).toContain(id);
    }
  });

  it('opening defaults: player1, selectPiece, no winner', () => {
    const state = createInitialState();
    expect(state.currentPlayer).toBe('player1');
    expect(state.phase).toBe('selectPiece');
    expect(state.winner).toBeNull();
    expect(state.selectedPiece).toBeNull();
    expect(state.moveHistory).toEqual([]);
  });
});
