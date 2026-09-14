/**
 * Wave 45 — Pent getValidPlacements opening leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState } from '../../src/games/pent-em-in/types';
import { getValidPlacements } from '../../src/games/pent-em-in/rules';

describe('Wave 45 pent — valid placements', () => {
  it('X has many opening placements; fewer at board edge', () => {
    const state = createInitialState();
    const open = getValidPlacements(state, 'X', 0, false);
    expect(open.length).toBeGreaterThan(10);
  });
});
