/**
 * Wave 66 leftover after tip/#316 — Kings piece 80% + text-shadow exact.
 * Soft seat gradients; lock size/text-shadow leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 66 kings — renderer piece size shadow exact', () => {
  it('piece width/height 80% + text-shadow exact', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('width: 80%');
    expect(css).toContain('height: 80%');
    expect(css).toContain('text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5)');
  });
});
