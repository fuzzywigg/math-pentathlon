/**
 * Wave 44 overnight HEAVY — Fab selectBar1 phase/used gates.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBar1 } from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 fab — selectBar1 gates', () => {
  it('advances unused bar to selectingBar2', () => {
    const s = createInitialState();
    const id = [...s.fractionBars.keys()][0];
    const next = selectBar1(s, id);
    expect(next.selectedBar1).toBe(id);
    expect(next.phase).toBe('selectingBar2');
  });

  it('rejects used bar and wrong phase', () => {
    const s = createInitialState();
    const id = [...s.fractionBars.keys()][0];
    const used = {
      ...s,
      fractionBars: new Map(s.fractionBars).set(id, { ...s.fractionBars.get(id)!, used: true }),
    };
    expect(selectBar1(used, id)).toBe(used);
    expect(selectBar1(s, 'missing-bar')).toBe(s);
    const mid = selectBar1(s, id);
    expect(selectBar1(mid, [...s.fractionBars.keys()][1])).toBe(mid);
  });
});
