/**
 * Wave 65 leftover after tip/#313 — Kings mount .piece.king.player1. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 65 kings — mount piece king p1 class', () => {
  it('mounts .piece.king.player1', () => {
    const el = renderBoard(createInitialBoard());
    expect(el.querySelectorAll('.piece.king.player1')).toHaveLength(1);
  });
});
