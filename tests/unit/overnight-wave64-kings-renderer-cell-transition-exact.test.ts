/**
 * Wave 64 leftover after tip/#303 — Kings renderer cell transition exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 64 kings — renderer cell transition exact', () => {
  it('locks background-color 0.15s ease transition', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('transition: background-color 0.15s ease');
    expect(css).toContain('cursor: pointer');
  });
});
