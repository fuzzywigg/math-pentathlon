/**
 * Wave 68 leftover after tip/#334 — Kings renderer piece 80% size exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 68 kings — renderer piece size 80', () => {
  it('.piece width/height 80% exact', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toMatch(/\.piece\s*\{[^}]*width:\s*80%/s);
    expect(css).toMatch(/\.piece\s*\{[^}]*height:\s*80%/s);
  });
});
