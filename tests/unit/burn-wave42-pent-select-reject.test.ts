/**
 * Wave 42 — Pent'Em In selectPiece reject opponent/unavailable leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { selectPiece, placePiece } from '../../src/games/pent-em-in/rules';

describe('Wave 42 pent-em-in — selectPiece rejects', () => {
  it('cannot select shape not in current player available list', () => {
    const state = createInitialState();
    const forged = {
      ...state,
      player1Pieces: {
        available: state.player1Pieces.available.filter((id) => id !== 'P'),
        placed: ['P'],
      },
    };
    expect(selectPiece(forged, 'P')).toBe(forged);
  });

  it('player1 cannot select piece only on player2 tray during player1 turn', () => {
    let state = createInitialState();
    state = {
      ...state,
      player1Pieces: { available: ['F'], placed: [] },
      player2Pieces: {
        available: ['X', ...state.player2Pieces.available.filter((id) => id !== 'X')],
        placed: [],
      },
    };
    expect(selectPiece(state, 'X')).toBe(state);
    expect(selectPiece(state, 'F').selectedPiece).toBe('F');
  });

  it('after placing a shape it is unavailable to that same player later', () => {
    let state = createInitialState();
    state = placePiece(state, 'Y', { row: 1, col: 1 }, 0, false);
    expect(state.currentPlayer).toBe('player2');
    expect(state.player1Pieces.available).not.toContain('Y');
    expect(state.player1Pieces.placed).toContain('Y');
    state = { ...state, currentPlayer: 'player1', phase: 'selectPiece' };
    expect(selectPiece(state, 'Y')).toBe(state);
  });
});
