/**
 * Wave 40 — Fab-a-Diffy selectBar used/same-id/phase rejects.
 * After #177; tests-only.
 */
import { describe, it, expect } from 'vitest';

import {
  createInitialState,
  selectBar1,
  selectBar2,
  clearSelection,
  selectOperation,
} from '../../src/games/fab-a-diffy/rules';

describe('Wave 40 fab — select used/same/phase rejects', () => {
  it('selectBar1 identity wrong phase or used bar', () => {
    const state = createInitialState();
    const [id, bar] = [...state.fractionBars.entries()][0];
    const wrong = { ...state, phase: 'selectingBar2' as const };
    expect(selectBar1(wrong, id)).toBe(wrong);

    const bars = new Map(state.fractionBars);
    bars.set(id, { ...bar, used: true });
    const used = { ...state, fractionBars: bars };
    expect(selectBar1(used, id)).toBe(used);
  });

  it('selectBar2 rejects same id and used second bar', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    const a = ids[0];
    const b = ids[1];
    const after1 = selectBar1(state, a);
    expect(after1.phase).toBe('selectingBar2');
    expect(selectBar2(after1, a)).toBe(after1);

    const bars = new Map(after1.fractionBars);
    bars.set(b, { ...bars.get(b)!, used: true });
    const used2 = { ...after1, fractionBars: bars };
    expect(selectBar2(used2, b)).toBe(used2);
  });

  it('selectOperation identity without bars; clearSelection resets', () => {
    const state = createInitialState();
    expect(selectOperation(state, 'add')).toBe(state);
    const mid = {
      ...state,
      selectedBar1: 'x',
      selectedBar2: 'y',
      selectedOperation: 'add' as const,
      phase: 'confirmingMove' as const,
    };
    const cleared = clearSelection(mid);
    expect(cleared.selectedBar1).toBeNull();
    expect(cleared.phase).toBe('selectingBar1');
  });
});
