/**
 * Wave 45 — Contig getValidPlacements drops off-board results
 * Distinct leftover vs #204 rules / #207 fab-sum-core / #208 overnight core.
 * Tests-only.
 */

import { describe, it, expect } from 'vitest';
import { createInitialState, getAllPossibleResults, getValidPlacements } from '../../src/games/contig-60/types';

describe('Wave 45 Contig — valids drop off-board', () => {
  it('filters results absent from BOARD_NUMBERS', () => {
    const dice: [number, number, number] = [4, 5, 6]; // 4*(5+6)=44 is off-board
    const all = getAllPossibleResults(dice);
    const state = createInitialState();
    const valids = getValidPlacements(state, dice);
    expect(valids.every((v) => state.cells.has(v.result))).toBe(true);
    const off = all.filter((r) => !state.cells.has(r.result));
    expect(off.length).toBeGreaterThan(0);
    expect(valids.every((v) => !off.some((o) => o.result === v.result))).toBe(true);
  });
});
