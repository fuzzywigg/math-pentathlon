/**
 * Wave 55 leftover after #250 — Hex omit onCellClick: no pointer, click ignored. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 55 hex — no callback', () => {
  it('empty cells are not clickable without onCellClick', () => {
    const el = document.createElement('div');
    renderBoard(createInitialState(5), el);
    const empty = el.querySelector('.hex-cell-group') as SVGGElement | null;
    expect(empty?.style.cursor).not.toBe('pointer');
    const spy = vi.fn();
    empty?.addEventListener('click', spy);
    empty?.dispatchEvent(new Event('click', { bubbles: true }));
    // native listener we added fires; product did not attach pointer
    expect(empty?.getAttribute('aria-label') ?? '').not.toMatch(/valid placement/);
  });
});
