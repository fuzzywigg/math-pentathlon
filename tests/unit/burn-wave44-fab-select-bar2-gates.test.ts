/**
 * Wave 44 overnight HEAVY — Fab selectBar2 same-bar / used / phase.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBar1, selectBar2 } from '../../src/games/fab-a-diffy/rules';

describe('Wave 44 fab — selectBar2 gates', () => {
  it('rejects same as bar1 and used second bar', () => {
    const s = createInitialState();
    const [a, b] = [...s.fractionBars.keys()];
    const mid = selectBar1(s, a);
    expect(selectBar2(mid, a)).toBe(mid);
    const usedB = {
      ...mid,
      fractionBars: new Map(mid.fractionBars).set(b, { ...mid.fractionBars.get(b)!, used: true }),
    };
    expect(selectBar2(usedB, b)).toBe(usedB);
  });

  it('advances to selectingOperation', () => {
    const s = createInitialState();
    const [a, b] = [...s.fractionBars.keys()];
    const next = selectBar2(selectBar1(s, a), b);
    expect(next.selectedBar2).toBe(b);
    expect(next.phase).toBe('selectingOperation');
  });
});
