/**
 * Wave 46 — Pent getValidPlacements F vs X opening leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getValidPlacements } from '../../src/games/pent-em-in/rules';

describe('Wave 46 pent — F vs X valids', () => {
  it('both F and X have opening placements', () => {
    const state = createInitialState();
    expect(getValidPlacements(state, 'F', 0, false).length).toBeGreaterThan(0);
    expect(getValidPlacements(state, 'X', 0, false).length).toBeGreaterThan(0);
  });
});
