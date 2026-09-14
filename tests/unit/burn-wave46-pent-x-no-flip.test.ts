/**
 * Wave 46 — Pent X cannot flip leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { selectPiece, flipSelectedPiece } from '../../src/games/pent-em-in/rules';

describe('Wave 46 pent — X no flip', () => {
  it('flipSelectedPiece on X is identity for flip flag', () => {
    const x = selectPiece(createInitialState(), 'X');
    const flipped = flipSelectedPiece(x);
    // X typically cannot flip — flag stays false
    expect(flipped.selectedFlipped).toBe(false);
    expect(flipped.selectedPiece).toBe('X');
  });
});
