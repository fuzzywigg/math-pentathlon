/**
 * Wave 66 leftover after tip/#316 — Kings .piece.king border-radius exact.
 * Soft piece.king radius soft; lock 8px scoped leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 66 kings — renderer piece king radius exact', () => {
  it('piece.king border-radius 8px scoped', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toMatch(/\.piece\.king\s*\{[^}]*border-radius:\s*8px/s);
  });
});
