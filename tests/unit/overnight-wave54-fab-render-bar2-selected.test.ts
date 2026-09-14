/**
 * Wave 54 leftover after #240 — Fab bar2 selected class (wave53 covered bar1). Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBar1, selectBar2 } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 54 fab — bar2 selected', () => {
  it('marks both selectedBar1 and selectedBar2', () => {
    const base = createInitialState();
    const [a, b] = [...base.fractionBars.keys()];
    const state = selectBar2(selectBar1(base, a), b);
    const el = renderFractionBarPool(state, () => undefined);
    const selected = [...el.querySelectorAll('.fab-bar-selected')] as HTMLElement[];
    expect(selected.map((n) => n.dataset.barId).sort()).toEqual([a, b].sort());
  });
});
