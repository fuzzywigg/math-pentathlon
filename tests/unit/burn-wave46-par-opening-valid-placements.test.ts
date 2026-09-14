/**
 * Wave 46 — Par 55 opening getValidPlacements non-empty leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidPlacements, isValidPlacement } from '../../src/games/par-55/rules';

describe('Wave 46 par — opening valids', () => {
  it('opening has placements adjacent to seed; seed itself invalid', () => {
    const state = createInitialState();
    const valids = getValidPlacements(state);
    expect(valids.length).toBeGreaterThan(0);
    const seed = [...state.bases.values()].find((b) => b.block)!;
    expect(isValidPlacement(state, seed.id)).toBe(false);
    expect(valids.every((id) => isValidPlacement(state, id))).toBe(true);
  });
});
