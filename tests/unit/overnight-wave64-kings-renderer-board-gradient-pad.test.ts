/**
 * Wave 64 leftover after tip/#303 — Kings board gradient #f4a460 + padding. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 64 kings — renderer board gradient pad', () => {
  it('locks #f4a460 board gradient + padding 16px', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('linear-gradient(135deg, #f4a460 0%, #daa520 50%, #f4a460 100%)');
    expect(css).toMatch(/\.game-board\s*\{[^}]*padding:\s*16px/s);
  });
});
