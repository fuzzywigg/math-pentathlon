/**
 * Wave 65 leftover after tip/#313 — Kings renderer piece font-weight bold. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 65 kings — renderer piece font-weight bold', () => {
  it('piece font-weight bold', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('font-weight: bold');
  });
});
