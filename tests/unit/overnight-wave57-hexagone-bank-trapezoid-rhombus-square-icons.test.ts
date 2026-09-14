/**
 * Wave 57 leftover after #263 — Hex-a-Gone trapezoid/rhombus/square bank icons. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialState, INITIAL_BANK } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 57 hexagone — bank leftover icons', () => {
  it('trapezoid/rhombus/square icons and counts', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(), el);
    const trap = el.querySelector('[data-shape="trapezoid"]');
    expect(trap?.querySelector('.block-icon')?.textContent).toBe('⏢');
    expect(trap?.querySelector('.block-count')?.textContent).toBe(
      `${INITIAL_BANK.trapezoid} left`
    );
    const rhom = el.querySelector('[data-shape="rhombus"]');
    expect(rhom?.querySelector('.block-icon')?.textContent).toBe('◇');
    expect(rhom?.querySelector('.block-count')?.textContent).toBe(
      `${INITIAL_BANK.rhombus} left`
    );
    const sq = el.querySelector('[data-shape="square"]');
    expect(sq?.querySelector('.block-icon')?.textContent).toBe('□');
    expect(sq?.querySelector('.block-count')?.textContent).toBe(
      `${INITIAL_BANK.square} left`
    );
  });
});
