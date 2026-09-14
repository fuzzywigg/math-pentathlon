/**
 * Overnight TOKENMAXX HEAVY leftovers after tip — Kings piece seat gradients.
 * Wave55 covered board colors/grid; deepen player1/2 piece gradients. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 58 kings — renderer piece seat gradients', () => {
  it('injects player1/2 piece gradient leftovers', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('.piece.player1');
    expect(css).toContain('linear-gradient(135deg, #4169e1 0%, #1e3a8a 100%)');
    expect(css).toContain('.piece.player2');
    expect(css).toContain('linear-gradient(135deg, #dc2626 0%, #991b1b 100%)');
  });
});
