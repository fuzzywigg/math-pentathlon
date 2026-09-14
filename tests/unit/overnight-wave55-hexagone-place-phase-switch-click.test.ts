/**
 * Wave 55 leftover after #250 — Hex-a-Gone place-phase bank switch click. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { selectBlock, commitSelection } from '../../src/games/hex-a-gone/rules';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hexagone — place switch', () => {
  it('selected placing blocks click; unselected hexagon does not', () => {
    let s = selectBlock(createInitialState(), 'triangle');
    s = selectBlock(s, 'rhombus');
    s = commitSelection(s);
    const spy = vi.fn();
    const el = document.createElement('div');
    renderBoard(s, el, undefined, spy);
    expect(el.querySelector('[data-shape="rhombus"]')?.classList.contains('placing')).toBe(
      false
    );
    expect(el.querySelector('[data-shape="triangle"]')?.classList.contains('placing')).toBe(
      true
    );
    (el.querySelector('[data-shape="rhombus"]') as HTMLButtonElement).click();
    expect(spy).toHaveBeenCalledWith('rhombus');
    spy.mockClear();
    (el.querySelector('[data-shape="hexagon"]') as HTMLButtonElement).click();
    expect(spy).not.toHaveBeenCalled();
  });
});
