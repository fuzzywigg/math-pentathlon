/**
 * Wave 46 — Pent getPlayerPieces tray leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getPlayerPieces } from '../../src/games/pent-em-in/types';

describe('Wave 46 pent — getPlayerPieces', () => {
  it('returns seat-specific trays', () => {
    const state = createInitialState();
    expect(getPlayerPieces(state, 'player1')).toBe(state.player1Pieces);
    expect(getPlayerPieces(state, 'player2')).toBe(state.player2Pieces);
  });
});
