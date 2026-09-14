/**
 * Wave 45 — Pent select/rotate/flip/cancel leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import {
  selectPiece,
  rotateSelectedPiece,
  flipSelectedPiece,
  cancelSelection,
} from '../../src/games/pent-em-in/rules';

describe('Wave 45 pent — select rotate flip', () => {
  it('select L5 then rotate cycles; cancel resets', () => {
    const state = createInitialState();
    const sel = selectPiece(state, 'L5');
    expect(sel.phase).toBe('placePiece');
    expect(sel.selectedPiece).toBe('L5');
    const r1 = rotateSelectedPiece(sel);
    expect(r1.selectedRotation).toBe(90);
    const r2 = rotateSelectedPiece(r1);
    expect(r2.selectedRotation).toBe(180);
    const flipped = flipSelectedPiece(r2);
    expect(flipped.selectedFlipped).toBe(true);
    const cancelled = cancelSelection(flipped);
    expect(cancelled.selectedPiece).toBeNull();
    expect(cancelled.phase).toBe('selectPiece');
  });

  it('select unknown is identity; X rotate stays selected', () => {
    const state = createInitialState();
    expect(selectPiece(state, 'ZZZ')).toBe(state);
    const x = selectPiece(state, 'X');
    const rotated = rotateSelectedPiece(x);
    expect(rotated.selectedPiece).toBe('X');
  });
});
