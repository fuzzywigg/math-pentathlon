/**
 * Wave 46 — Pent selectPiece unavailable leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { selectPiece } from '../../src/games/pent-em-in/rules';

describe('Wave 46 pent — select unavailable', () => {
  it('identity when shape already placed', () => {
    const state = createInitialState();
    const forged = {
      ...state,
      player1Pieces: {
        available: state.player1Pieces.available.filter((id) => id !== 'Y'),
        placed: ['Y'],
      },
    };
    expect(selectPiece(forged, 'Y')).toBe(forged);
  });
});
