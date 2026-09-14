/**
 * Wave 53 leftover after #235 — Fab bar selected class. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBar1 } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — bar selected', () => {
  it('adds .fab-bar-selected on chosen bar1', () => {
    const base = createInitialState();
    const id = [...base.fractionBars.keys()][0];
    const state = selectBar1(base, id);
    const el = renderFractionBarPool(state, () => undefined);
    const selected = el.querySelectorAll('.fab-bar-selected');
    expect(selected.length).toBe(1);
    expect((selected[0] as HTMLElement).dataset.barId).toBe(id);
  });
});
