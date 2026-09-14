/**
 * Wave 43 TOKENMAXX — Fab selectBar2 reject gates. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectBar1,
  selectBar2,
} from '../../src/games/fab-a-diffy/rules';

describe('Wave 43 fab — selectBar2 gates', () => {
  it('rejects wrong phase, missing, used, and self-pick', () => {
    const state = createInitialState();
    const ids = [...state.fractionBars.keys()];
    expect(selectBar2(state, ids[1])).toBe(state);

    let mid = selectBar1(state, ids[0]);
    expect(selectBar2(mid, 'missing-bar')).toBe(mid);
    expect(selectBar2(mid, ids[0])).toBe(mid);

    const usedMap = new Map(mid.fractionBars);
    usedMap.set(ids[1], { ...usedMap.get(ids[1])!, used: true });
    const used = { ...mid, fractionBars: usedMap };
    expect(selectBar2(used, ids[1])).toBe(used);

    mid = selectBar2(mid, ids[1]);
    expect(mid.phase).toBe('selectingOperation');
    expect(mid.selectedBar2).toBe(ids[1]);
  });
});
