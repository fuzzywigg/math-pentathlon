/**
 * Wave 42 — Fab-a-Diffy clearSelection mid-flow leftovers. Tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBar1,
  selectBar2,
  selectOperation,
  clearSelection,
} from '../../src/games/fab-a-diffy/rules';

describe('Wave 42 fab — clear mid-flow', () => {
  it('clears after bar2 selection', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    let next = selectBar1(state, ids[0]);
    next = selectBar2(next, ids[1]);
    const cleared = clearSelection(next);
    expect(cleared.phase).toBe('selectingBar1');
    expect(cleared.selectedBar1).toBeNull();
    expect(cleared.selectedBar2).toBeNull();
  });

  it('clears after operation confirmation prep', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    let next = selectBar1(state, ids[4]);
    next = selectBar2(next, ids[5]);
    next = selectOperation(next, 'divide');
    expect(next.phase).toBe('confirmingMove');
    const cleared = clearSelection(next);
    expect(cleared.selectedOperation).toBeNull();
    expect(cleared.phase).toBe('selectingBar1');
  });
});
