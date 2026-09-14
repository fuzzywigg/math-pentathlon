/**
 * Wave 56 leftover after #256 — Hex empty cell Space activates click. Tests-only.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { createInitialState } from '../../src/games/hex/types';
import { renderBoard } from '../../src/games/hex/board-ui';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Wave 56 hex — Space activate', () => {
  it('Space on empty cell calls onCellClick', () => {
    const onClick = vi.fn();
    const el = document.createElement('div');
    renderBoard(createInitialState(5), el, onClick);
    const cell = el.querySelector('[data-row="0"][data-col="0"]') as SVGGElement;
    cell.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onClick).toHaveBeenCalledWith(0, 0);
  });
});
