/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Kings board size + cell hover.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 58 kings — renderer board size hover', () => {
  it('board 450px / #daa520 and cell hover #ffe4b5 leftover', () => {
    const el = renderBoard(createInitialBoard());
    expect(el.classList.contains('game-board')).toBe(true);
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('width: 450px');
    expect(css).toContain('height: 450px');
    expect(css).toContain('#daa520');
    expect(css).toContain('.cell:hover');
    expect(css).toContain('background-color: #ffe4b5');
  });
});
