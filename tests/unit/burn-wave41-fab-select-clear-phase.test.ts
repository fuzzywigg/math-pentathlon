/**
 * Wave 41 — Fab-a-Diffy selectBar / clearSelection phase guards. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBar1,
  selectBar2,
  clearSelection,
  selectOperation,
} from '../../src/games/fab-a-diffy/rules';
import type { FabADiffyState } from '../../src/games/fab-a-diffy/types';

describe('Wave 41 fab-a-diffy — select clear phase', () => {
  it('selectBar1 identity on wrong phase / missing / used', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    const wrongPhase: FabADiffyState = { ...state, phase: 'selectingBar2' };
    expect(selectBar1(wrongPhase, ids[0])).toBe(wrongPhase);
    expect(selectBar1(state, 'no-bar')).toBe(state);

    const usedBars = new Map(state.fractionBars);
    const first = usedBars.get(ids[0])!;
    usedBars.set(ids[0], { ...first, used: true });
    const usedState: FabADiffyState = { ...state, fractionBars: usedBars };
    expect(selectBar1(usedState, ids[0])).toBe(usedState);
  });

  it('selectBar2 rejects same id / used / wrong phase', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    const mid = selectBar1(state, ids[0]);
    expect(mid.phase).toBe('selectingBar2');
    expect(selectBar2(mid, ids[0])).toBe(mid); // same as bar1
    expect(selectBar2(state, ids[1])).toBe(state); // wrong phase
    expect(selectBar2(mid, 'ghost')).toBe(mid);
  });

  it('clearSelection resets bars/ops to selectingBar1', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    let next = selectBar1(state, ids[0]);
    next = selectBar2(next, ids[1]);
    next = selectOperation(next, 'add');
    expect(next.phase).toBe('confirmingMove');
    const cleared = clearSelection(next);
    expect(cleared.selectedBar1).toBeNull();
    expect(cleared.selectedBar2).toBeNull();
    expect(cleared.selectedOperation).toBeNull();
    expect(cleared.phase).toBe('selectingBar1');
  });
});
