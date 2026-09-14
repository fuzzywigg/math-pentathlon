/**
 * Wave 53 leftover after #235 — Fab bar aria selected/used extras. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBar1 } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — bar aria extras', () => {
  it('aria-label includes selected and used extras', () => {
    const base = createInitialState();
    const [idSel, idUsed] = [...base.fractionBars.keys()];
    const bars = new Map(base.fractionBars);
    bars.set(idUsed, { ...bars.get(idUsed)!, used: true });
    const selected = selectBar1({ ...base, fractionBars: bars }, idSel);
    const el = renderFractionBarPool(selected, () => undefined);
    const selLabel = (el.querySelector(`[data-bar-id="${idSel}"]`) as HTMLElement).getAttribute('aria-label') || '';
    const usedLabel = (el.querySelector(`[data-bar-id="${idUsed}"]`) as HTMLElement).getAttribute('aria-label') || '';
    expect(selLabel.toLowerCase()).toContain('selected');
    expect(usedLabel.toLowerCase()).toContain('used');
  });
});
