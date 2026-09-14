/**
 * Wave 64 leftover after tip/#303 — Kings piece seat box-shadow exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 64 kings — renderer piece seat shadow', () => {
  it('player1/2 piece box-shadow 0 2px 4px rgba(0,0,0,0.3)', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('.piece.player1');
    expect(css).toContain('.piece.player2');
    expect(css).toContain('box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3)');
  });
});
