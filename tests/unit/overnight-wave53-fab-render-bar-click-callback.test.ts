/**
 * Wave 53 leftover after #235 — Fab bar click callback. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — bar click', () => {
  it('fires onBarClick with bar id', () => {
    const state = createInitialState();
    const id = [...state.fractionBars.keys()][3];
    const onClick = vi.fn();
    const el = renderFractionBarPool(state, onClick);
    (el.querySelector(`[data-bar-id="${id}"]`) as HTMLElement).click();
    expect(onClick).toHaveBeenCalledWith(id);
  });
});
