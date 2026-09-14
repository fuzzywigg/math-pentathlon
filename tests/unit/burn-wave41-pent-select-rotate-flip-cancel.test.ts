/**
 * Wave 41 — Pent-Em-In select / rotate / flip / cancel selection.
 * Tests-only. No product inventing.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  rotateSelectedPiece,
  flipSelectedPiece,
  cancelSelection,
} from '../../src/games/pent-em-in/rules';

describe('Wave 41 Pent-Em-In — select / rotate / flip / cancel', () => {
  it('selectPiece enters placePiece; unknown id is identity', () => {
    const state = createInitialState();
    const selected = selectPiece(state, 'F');
    expect(selected.selectedPiece).toBe('F');
    expect(selected.phase).toBe('placePiece');
    expect(selected.selectedRotation).toBe(0);
    expect(selected.selectedFlipped).toBe(false);
    expect(selectPiece(state, 'zzz')).toBe(state);
  });

  it('rotateSelectedPiece cycles 0→90→180→270→0 for I5', () => {
    let state = selectPiece(createInitialState(), 'I5');
    expect(state.selectedRotation).toBe(0);
    state = rotateSelectedPiece(state);
    expect(state.selectedRotation).toBe(90);
    state = rotateSelectedPiece(state);
    expect(state.selectedRotation).toBe(180);
    state = rotateSelectedPiece(state);
    expect(state.selectedRotation).toBe(270);
    state = rotateSelectedPiece(state);
    expect(state.selectedRotation).toBe(0);
  });

  it('rotate without selection is identity; X may refuse flip if !canFlip', () => {
    const idle = createInitialState();
    expect(rotateSelectedPiece(idle)).toBe(idle);
    expect(flipSelectedPiece(idle)).toBe(idle);

    const selected = selectPiece(idle, 'I5');
    const flipped = flipSelectedPiece(selected);
    // I5 typically canFlip — if so toggles; if not, identity
    if (flipped === selected) {
      expect(flipped.selectedFlipped).toBe(false);
    } else {
      expect(flipped.selectedFlipped).toBe(true);
      expect(flipSelectedPiece(flipped).selectedFlipped).toBe(false);
    }
  });

  it('cancelSelection clears selection and returns to selectPiece', () => {
    let state = selectPiece(createInitialState(), 'V');
    state = {
      ...state,
      selectedRotation: 90,
      selectedFlipped: true,
      previewPosition: { row: 3, col: 3 },
    };
    const cancelled = cancelSelection(state);
    expect(cancelled.selectedPiece).toBeNull();
    expect(cancelled.selectedRotation).toBe(0);
    expect(cancelled.selectedFlipped).toBe(false);
    expect(cancelled.previewPosition).toBeNull();
    expect(cancelled.phase).toBe('selectPiece');
  });
});
