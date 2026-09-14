/**
 * Wave 55 leftover after #250 — Hex-a-Gone empty bank button has empty class, no click. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState } from '../../src/games/hex-a-gone/types';
import { renderBoard } from '../../src/games/hex-a-gone/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hexagone — empty bank click', () => {
  it('hexagon empty does not call onBlockSelect', () => {
    const spy = vi.fn();
    const s = createInitialState();
    const el = document.createElement('div');
    renderBoard({ ...s, bank: { ...s.bank, hexagon: 0 } }, el, undefined, spy);
    const hex = el.querySelector('[data-shape="hexagon"]') as HTMLButtonElement;
    expect(hex.classList.contains('empty')).toBe(true);
    hex.click();
    expect(spy).not.toHaveBeenCalled();
    expect(el.querySelector('[data-shape="triangle"]')?.classList.contains('empty')).toBe(
      false
    );
  });
});
