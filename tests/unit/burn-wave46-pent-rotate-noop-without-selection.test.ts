/**
 * Wave 46 — Pent rotate without selection leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { rotateSelectedPiece, flipSelectedPiece } from '../../src/games/pent-em-in/rules';

describe('Wave 46 pent — rotate noop', () => {
  it('rotate/flip without selection are identity', () => {
    const state = createInitialState();
    expect(rotateSelectedPiece(state)).toBe(state);
    expect(flipSelectedPiece(state)).toBe(state);
  });
});
