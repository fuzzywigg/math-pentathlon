/**
 * Wave 42 — Pent'Em In rotate/flip/cancel/preview selection leftovers after #186.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  rotateSelectedPiece,
  flipSelectedPiece,
  cancelSelection,
  setPreviewPosition,
} from '../../src/games/pent-em-in/rules';

describe('Wave 42 pent-em-in — selection rotate flip cancel preview', () => {
  it('rotateSelectedPiece cycles 0→90→180→270→0 for L5', () => {
    let state = selectPiece(createInitialState(), 'L5');
    const rotations = [0, 90, 180, 270, 0];
    for (let i = 0; i < rotations.length; i++) {
      expect(state.selectedRotation).toBe(rotations[i]);
      if (i < rotations.length - 1) state = rotateSelectedPiece(state);
    }
  });

  it('flipSelectedPiece toggles for flippable Y', () => {
    let state = selectPiece(createInitialState(), 'Y');
    expect(state.selectedFlipped).toBe(false);
    state = flipSelectedPiece(state);
    expect(state.selectedFlipped).toBe(true);
    state = flipSelectedPiece(state);
    expect(state.selectedFlipped).toBe(false);
  });

  it('cancelSelection resets selection, preview, phase', () => {
    let state = selectPiece(createInitialState(), 'N');
    state = rotateSelectedPiece(state);
    state = flipSelectedPiece(state);
    state = setPreviewPosition(state, { row: 5, col: 5 });
    const cancelled = cancelSelection(state);
    expect(cancelled.selectedPiece).toBeNull();
    expect(cancelled.selectedRotation).toBe(0);
    expect(cancelled.selectedFlipped).toBe(false);
    expect(cancelled.previewPosition).toBeNull();
    expect(cancelled.phase).toBe('selectPiece');
  });

  it('setPreviewPosition updates preview cell independently', () => {
    let state = selectPiece(createInitialState(), 'W');
    state = setPreviewPosition(state, { row: 2, col: 7 });
    expect(state.previewPosition).toEqual({ row: 2, col: 7 });
    state = setPreviewPosition(state, null);
    expect(state.previewPosition).toBeNull();
  });
});
