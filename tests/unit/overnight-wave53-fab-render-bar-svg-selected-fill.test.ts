/**
 * Wave 53 leftover after #235 — Fab selected/used SVG fills. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBar1 } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — bar svg fills', () => {
  it('selected uses #ff9800 fill; used uses #bdbdbd', () => {
    const base = createInitialState();
    const [idSel, idUsed] = [...base.fractionBars.keys()];
    const bars = new Map(base.fractionBars);
    bars.set(idUsed, { ...bars.get(idUsed)!, used: true });
    const state = selectBar1({ ...base, fractionBars: bars }, idSel);
    const el = renderFractionBarPool(state, () => undefined);
    const selRects = [...el.querySelectorAll(`[data-bar-id="${idSel}"] rect`)];
    const usedRects = [...el.querySelectorAll(`[data-bar-id="${idUsed}"] rect`)];
    expect(selRects.some((r) => r.getAttribute('fill') === '#ff9800')).toBe(true);
    expect(usedRects.some((r) => r.getAttribute('fill') === '#bdbdbd')).toBe(true);
  });
});
