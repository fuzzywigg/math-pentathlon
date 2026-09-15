/**
 * Wave 66 leftover after tip/#316 — Kings cell cursor pointer exact.
 * Soft fill/border; lock cursor leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 66 kings — renderer cell cursor pointer exact', () => {
  it('cell cursor pointer + flex center exact', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toMatch(/\.cell\s*\{[^}]*cursor:\s*pointer/s);
    expect(css).toMatch(/\.cell\s*\{[^}]*align-items:\s*center/s);
    expect(css).toMatch(/\.cell\s*\{[^}]*justify-content:\s*center/s);
  });
});
