/**
 * Wave 53 leftover after #235 — Fab bar1 disabled while selectingBar2. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBar1 } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — bar1 disabled in bar2', () => {
  it('selected bar1 is disabled while other bars stay selectable', () => {
    const base = createInitialState();
    const id = [...base.fractionBars.keys()][0];
    const state = selectBar1(base, id);
    const el = renderFractionBarPool(state, () => undefined);
    const bar1 = el.querySelector(`[data-bar-id="${id}"]`) as HTMLElement;
    expect(bar1.classList.contains('fab-bar-selected')).toBe(true);
    expect(bar1.classList.contains('fab-bar-disabled')).toBe(true);
    const others = [...el.querySelectorAll('.fab-bar-wrapper')].filter(
      (n) => (n as HTMLElement).dataset.barId !== id
    ) as HTMLElement[];
    expect(others.every((w) => !w.classList.contains('fab-bar-disabled'))).toBe(true);
  });
});
