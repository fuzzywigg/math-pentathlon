/**
 * Wave 53 leftover after #235 — Fab bars disabled in selectingOperation. Tests-only.
 */
import { describe, it, expect } from 'vitest';
import { createInitialState, selectBar1, selectBar2 } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — bars disabled in op phase', () => {
  it('disables all bars once both selected', () => {
    const base = createInitialState();
    const [a, b] = [...base.fractionBars.keys()];
    const state = selectBar2(selectBar1(base, a), b);
    expect(state.phase).toBe('selectingOperation');
    const el = renderFractionBarPool(state, () => undefined);
    const wraps = [...el.querySelectorAll('.fab-bar-wrapper')];
    expect(wraps.every((w) => w.classList.contains('fab-bar-disabled'))).toBe(true);
  });
});
