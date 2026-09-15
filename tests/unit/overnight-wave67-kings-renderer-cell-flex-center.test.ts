/**
 * Wave 67 leftover after tip/#324 — Kings cell flex centering exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 67 kings — renderer cell flex center', () => {
  it('.cell display flex + align/justify center', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toMatch(/\.cell\s*\{[^}]*display:\s*flex/s);
    expect(css).toMatch(/\.cell\s*\{[^}]*align-items:\s*center/s);
    expect(css).toMatch(/\.cell\s*\{[^}]*justify-content:\s*center/s);
  });
});
