/**
 * Wave 44 — Contig getValidPlacements leftover filter.
 * Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/contig-60/types';

describe('Wave 44 Contig — valid placements unowned', () => {
  it('filters claimed cells from dice results', () => {
    let state = createInitialState();
    const cells = new Map(state.cells);
    cells.set(6, { ...cells.get(6)!, owner: 'player1' });
    cells.set(24, { ...cells.get(24)!, owner: 'player2' });
    state = { ...state, cells };
    const placements = getValidPlacements(state, [2, 3, 4]);
    const results = placements.map((p) => p.result);
    expect(results).not.toContain(6);
    expect(results).not.toContain(24);
    expect(results.every((v) => state.cells.get(v)?.owner === null)).toBe(true);
  });
});
