/**
 * Wave 41 — Pent\'Em In placePiece OOB identity + setPreview null.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  placePiece,
  setPreviewPosition,
  getValidPlacements,
} from '../../src/games/pent-em-in/rules';

describe('Wave 41 pent — place OOB identity', () => {
  it('placePiece far OOB returns identity', () => {
    let state = createInitialState();
    const id = state.player1Pieces.available[0];
    state = selectPiece(state, id);
    const next = placePiece(state, id, { row: 99, col: 99 }, 0, false);
    expect(next).toBe(state);
  });

  it('setPreviewPosition null clears preview', () => {
    let state = createInitialState();
    state = selectPiece(state, state.player1Pieces.available[0]);
    state = setPreviewPosition(state, { row: 1, col: 1 });
    expect(state.previewPosition).toEqual({ row: 1, col: 1 });
    state = setPreviewPosition(state, null);
    expect(state.previewPosition).toBeNull();
  });

  it('getValidPlacements for available piece may be nonempty on empty board', () => {
    const state = createInitialState();
    const id = state.player1Pieces.available[0];
    const spots = getValidPlacements(state, id, 0, false);
    expect(Array.isArray(spots)).toBe(true);
  });
});
