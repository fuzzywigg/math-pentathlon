/**
 * Wave 68 leftover after tip/#334 — Kings renderer board 450 square exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 68 kings — renderer board 450', () => {
  it('.game-board width/height 450px exact', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toMatch(/\.game-board\s*\{[^}]*width:\s*450px/s);
    expect(css).toMatch(/\.game-board\s*\{[^}]*height:\s*450px/s);
  });
});
