/**
 * Wave 53 leftover after #235 — Fab used bar class + no click. Tests-only.
 */
import { describe, it, expect, vi } from 'vitest';
import { createInitialState } from '../../src/games/fab-a-diffy/rules';
import { renderFractionBarPool } from '../../src/games/fab-a-diffy/board-ui';

describe('Wave 53 fab — bar used', () => {
  it('marks used bar disabled and ignores click', () => {
    const base = createInitialState();
    const id = [...base.fractionBars.keys()][0];
    const bars = new Map(base.fractionBars);
    bars.set(id, { ...bars.get(id)!, used: true });
    const state = { ...base, fractionBars: bars };
    const onClick = vi.fn();
    const el = renderFractionBarPool(state, onClick);
    const wrap = el.querySelector(`[data-bar-id="${id}"]`) as HTMLElement;
    expect(wrap.classList.contains('fab-bar-used')).toBe(true);
    expect(wrap.classList.contains('fab-bar-disabled')).toBe(true);
    wrap.click();
    expect(onClick).not.toHaveBeenCalled();
  });
});
