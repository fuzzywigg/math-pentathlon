/**
 * Wave 45 — Pent placePiece seat flip leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { placePiece } from '../../src/games/pent-em-in/rules';

describe('Wave 45 pent — place seat flip', () => {
  it('successful place flips to player2 and records history', () => {
    const state = createInitialState();
    const next = placePiece(state, 'X', { row: 2, col: 2 }, 0, false);
    expect(next.currentPlayer).toBe('player2');
    expect(next.moveHistory).toHaveLength(1);
    expect(next.player1Pieces.available).not.toContain('X');
    expect(next.phase).toBe('selectPiece');
  });

  it('invalid place is identity', () => {
    const state = createInitialState();
    expect(placePiece(state, 'X', { row: -2, col: 0 }, 0, false)).toBe(state);
  });
});
