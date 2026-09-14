/**
 * Overnight TOKENMAXX — hasAnyValidMove <2 bars leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, hasAnyValidMove } from '../../src/games/fab-a-diffy/rules';
import type { FractionBar } from '../../src/games/fab-a-diffy/types';

describe('Overnight fab — hasAnyValidMove single bar', () => {
  it('false when fewer than two unused bars', () => {
    let state = createInitialState();
    const bars = new Map<string, FractionBar>();
    const first = [...state.fractionBars.values()][0];
    bars.set(first.id, { ...first, used: false });
    for (const [id, b] of state.fractionBars) {
      if (id === first.id) continue;
      bars.set(id, { ...b, used: true });
    }
    state = { ...state, fractionBars: bars };
    expect(hasAnyValidMove(state)).toBe(false);
  });
});
