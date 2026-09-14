/**
 * Wave 63 leftover after #301 — Kings renderer piece font-size + text-shadow. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

describe('Wave 63 kings — renderer piece font-size', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  it('pins piece font-size 14px + white + text-shadow leftover', () => {
    renderBoard(createInitialBoard());
    const css =
      document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('font-size: 14px');
    expect(css).toContain('color: white');
    expect(css).toContain('text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5)');
    expect(css).toContain('gap: 2px');
  });
});
