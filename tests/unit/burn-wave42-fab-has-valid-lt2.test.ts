/**
 * Wave 42 — Fab-a-Diffy hasAnyValidMove with <2 bars false. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  hasAnyValidMove,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState, FractionBar } from '../../src/games/fab-a-diffy/types';

describe('Wave 42 fab — hasAnyValidMove <2 bars', () => {
  it('zero unused bars is false', () => {
    const state = createInitialState();
    const bars = new Map(state.fractionBars);
    for (const [id, b] of bars) bars.set(id, { ...b, used: true });
    expect(hasAnyValidMove({ ...state, fractionBars: bars })).toBe(false);
  });

  it('single unused bar is false', () => {
    const state = createInitialState();
    const all = [...state.fractionBars.values()];
    const bars = new Map<string, FractionBar>();
    all.forEach((b, i) => {
      bars.set(b.id, { ...b, used: i !== 0 });
    });
    const one: FabADiffyState = { ...state, fractionBars: bars };
    expect([...one.fractionBars.values()].filter((b) => !b.used)).toHaveLength(1);
    expect(hasAnyValidMove(one)).toBe(false);
  });

  it('fresh opening typically has a valid move', () => {
    expect(hasAnyValidMove(createInitialState())).toBe(true);
  });
});
