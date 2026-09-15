/**
 * Wave 67 leftover after tip/#324 — Kings renderer board box-shadow. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 67 kings — renderer board box-shadow', () => {
  it('game-board box-shadow 0 4px 12px rgba(0,0,0,0.3)', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('.game-board');
    expect(css).toContain('box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3)');
  });
});
