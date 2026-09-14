/**
 * Wave 46 — Pent cancelSelection from placePiece leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { selectPiece, cancelSelection } from '../../src/games/pent-em-in/rules';

describe('Wave 46 pent — cancel', () => {
  it('cancel returns to selectPiece with null selection', () => {
    const sel = selectPiece(createInitialState(), 'P');
    const cancelled = cancelSelection(sel);
    expect(cancelled.phase).toBe('selectPiece');
    expect(cancelled.selectedPiece).toBeNull();
    expect(cancelled.selectedRotation).toBe(0);
  });
});
