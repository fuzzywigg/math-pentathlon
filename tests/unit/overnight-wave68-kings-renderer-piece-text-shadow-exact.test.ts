/**
 * Wave 68 leftover after tip/#334 — Kings renderer piece text-shadow exact. Tests-only.
 * Soft text-shadow may exist elsewhere; lock .piece rule. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 68 kings — renderer piece text-shadow', () => {
  it('.piece text-shadow exact', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toMatch(
      /\.piece\s*\{[^}]*text-shadow:\s*1px 1px 2px rgba\(0, 0, 0, 0\.5\)/s
    );
  });
});
