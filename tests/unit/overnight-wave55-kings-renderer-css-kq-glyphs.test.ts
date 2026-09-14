/**
 * Wave 55 leftover after #250 — Kings board-renderer CSS + K/Q glyphs. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { createQuadraphage } from '../../src/games/kings-quadraphages/pieces';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 55 kings — renderer chrome', () => {
  it('injects board CSS and renders K/Q pieces', () => {
    const board = createInitialBoard();
    board[1][1] = createQuadraphage('player1');
    const el = renderBoard(board);
    expect(el.classList.contains('game-board')).toBe(true);
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('#f4a460');
    expect(css).toContain('#ffecd2');
    expect(css).toContain('#8b4513');
    expect(css).toContain('grid-template-columns: repeat(9, 1fr)');
    expect(el.querySelector('.piece.king.player1')?.textContent).toBe('K');
    expect(el.querySelector('.piece.quadraphage')?.textContent).toBe('Q');
  });
});
