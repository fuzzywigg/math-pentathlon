/**
 * Wave 64 leftover after tip/#303 — Kings renderer cell fill/border exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 64 kings — renderer cell fill border', () => {
  it('cell #ffecd2 fill + #8b4513 border exact', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('background-color: #ffecd2');
    expect(css).toContain('border: 1px solid #8b4513');
  });
});
