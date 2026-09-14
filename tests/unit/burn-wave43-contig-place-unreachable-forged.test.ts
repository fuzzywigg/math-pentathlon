/**
 * Wave 43 — Contig placeChip accepts forged unreachable value leftover. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, getValidPlacements } from '../../src/games/contig-60/types';
import { placeChip } from '../../src/games/contig-60/rules';

describe('Wave 43 contig — placeChip forged value', () => {
  it('places board value even if not in getValidPlacements for dice', () => {
    const state = {
      ...createInitialState(),
      phase: 'calculating' as const,
      currentDice: [1, 1, 1] as [number, number, number],
    };
    const valids = new Set(getValidPlacements(state, state.currentDice!).map((v) => v.result));
    // pick a board number not in valids if possible
    const candidate = [...state.cells.keys()].find((v) => !valids.has(v)) ?? 216;
    if (valids.has(candidate)) {
      // still assert place works for a valid
      const v = [...valids][0];
      const next = placeChip(state, v, 'forged');
      expect(next.cells.get(v)?.owner).toBe('player1');
      return;
    }
    const next = placeChip(state, candidate, 'forged-expr');
    expect(next).not.toBe(state);
    expect(next.cells.get(candidate)?.owner).toBe('player1');
    expect(next.phase).toBe('rolling');
  });
});
