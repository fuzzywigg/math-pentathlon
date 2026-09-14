/**
 * Wave 42 — Fab-a-Diffy selectBar2 same-id / used reject leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBar1,
  selectBar2,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 42 fab — selectBar2 reject', () => {
  it('same id as bar1 is identity', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    const mid = selectBar1(state, ids[0]);
    expect(selectBar2(mid, ids[0])).toBe(mid);
    expect(mid.phase).toBe('selectingBar2');
  });

  it('used second bar is identity', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    const mid = selectBar1(state, ids[0]);
    const bars = new Map(mid.fractionBars);
    const second = bars.get(ids[1])!;
    bars.set(ids[1], { ...second, used: true });
    const usedState: FabADiffyState = { ...mid, fractionBars: bars };
    expect(selectBar2(usedState, ids[1])).toBe(usedState);
  });

  it('distinct unused bar advances to selectingOperation', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    let next = selectBar1(state, ids[2]);
    next = selectBar2(next, ids[3]);
    expect(next.selectedBar1).toBe(ids[2]);
    expect(next.selectedBar2).toBe(ids[3]);
    expect(next.phase).toBe('selectingOperation');
  });
});
