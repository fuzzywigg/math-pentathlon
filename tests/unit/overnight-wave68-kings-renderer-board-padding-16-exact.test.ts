/**
 * Wave 68 leftover after tip/#334 — Kings renderer board padding 16px. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 68 kings — renderer board padding 16', () => {
  it('.game-board padding 16px exact', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toMatch(/\.game-board\s*\{[^}]*padding:\s*16px/s);
  });
});
