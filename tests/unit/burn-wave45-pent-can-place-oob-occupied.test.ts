/**
 * Wave 45 — Pent canPlacePiece OOB/occupied leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { canPlacePiece, placePiece } from '../../src/games/pent-em-in/rules';

describe('Wave 45 pent — canPlace fences', () => {
  it('rejects OOB for I5 and occupied after X place', () => {
    const state = createInitialState();
    expect(canPlacePiece(state, 'I5', { row: -1, col: 0 }, 0, false)).toBe(false);
    const next = placePiece(state, 'X', { row: 2, col: 2 }, 0, false);
    expect(canPlacePiece(next, 'X', { row: 2, col: 2 }, 0, false)).toBe(false);
  });
});
