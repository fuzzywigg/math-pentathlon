/**
 * Wave 53 leftover after #235 — Fab bar keyboard activate. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — bar keyboard', () => {
  it('Enter/Space activate selectable bar', () => {
    const state = createInitialState();
    const id = [...state.fractionBars.keys()][1];
    const onClick = vi.fn();
    const el = renderFractionBarPool(state, onClick);
    const wrap = el.querySelector(`[data-bar-id="${id}"]`) as HTMLElement;
    wrap.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    wrap.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onClick).toHaveBeenCalledWith(id);
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});
