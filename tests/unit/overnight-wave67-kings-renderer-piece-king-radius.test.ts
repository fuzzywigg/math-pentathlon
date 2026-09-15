/**
 * Wave 67 leftover after tip/#324 — Kings renderer .piece.king radius exact. Tests-only.
 * Soft king radius existed elsewhere; lock selector-scoped rule. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 67 kings — renderer piece king radius', () => {
  it('.piece.king border-radius 8px exact', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toMatch(/\.piece\.king\s*\{[^}]*border-radius:\s*8px/s);
  });
});
