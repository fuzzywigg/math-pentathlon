/**
 * Wave 42 — Contig expression parentheses / order-of-ops leftovers.
 * Distinct from wave41 div-even. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/contig-60/types';

describe('Wave 42 Contig — expr order', () => {
  it('dice [2,3,6] yields multiple distinct results including paren products', () => {
    const state = createInitialState();
    const placements = getValidPlacements(state, [2, 3, 6]);
    const results = new Set(placements.map((p) => p.result));
    expect(results.size).toBeGreaterThan(3);
    expect(results.has(2 + 3 + 6) || results.has(2 * 3 * 6) || results.has(36)).toBe(true);
    for (const p of placements) {
      expect(state.cells.has(p.result)).toBe(true);
      expect(p.expression.length).toBeGreaterThan(0);
    }
  });
});
