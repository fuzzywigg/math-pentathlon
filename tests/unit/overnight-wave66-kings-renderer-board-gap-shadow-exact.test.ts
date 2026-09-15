/**
 * Wave 66 leftover after tip/#316 — Kings board gap + outer box-shadow exact.
 * Soft 450px/hover; lock gap 2px + 0 4px 12px leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 66 kings — renderer board gap shadow exact', () => {
  it('game-board gap 2px + box-shadow 0 4px 12px rgba exact', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('gap: 2px');
    expect(css).toContain('box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3)');
    expect(css).toContain('border-radius: 8px');
  });
});
