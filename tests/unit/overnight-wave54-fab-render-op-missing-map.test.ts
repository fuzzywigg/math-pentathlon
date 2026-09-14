/**
 * Wave 54 leftover after #240 — Fab op selector empty when bar ids missing from map. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBar1, selectBar2 } from '../../src/games/fab-a-diffy/rules';
import { renderOperationSelector } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 54 fab — op missing map', () => {
  it('returns empty selector when selected ids are gone from fractionBars', () => {
    const base = createInitialState();
    const [a, b] = [...base.fractionBars.keys()];
    let state = selectBar2(selectBar1(base, a), b);
    const bars = new Map(state.fractionBars);
    bars.delete(a);
    bars.delete(b);
    state = { ...state, fractionBars: bars };
    const el = renderOperationSelector(state, () => undefined);
    expect(el.classList.contains('fab-operation-selector')).toBe(true);
    expect(el.querySelector('.fab-operation-preview')).toBeNull();
    expect(el.querySelectorAll('.fab-op-btn').length).toBe(0);
  });
});
