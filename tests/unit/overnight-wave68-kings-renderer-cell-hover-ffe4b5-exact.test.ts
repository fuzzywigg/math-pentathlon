/**
 * Wave 68 leftover after tip/#334 — Kings renderer cell hover fill exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 68 kings — renderer cell hover fill', () => {
  it('.cell:hover background #ffe4b5 exact', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toMatch(/\.cell:hover\s*\{[^}]*background-color:\s*#ffe4b5/s);
  });
});
