/**
 * Wave 68 leftover after tip/#336 — Kings renderer player1/2 gradients. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

describe('Wave 68 kings — renderer piece seat gradients', () => {
  beforeEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });
  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  it('player1 4169e1 + player2 dc2626 gradients', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('#4169e1');
    expect(css).toContain('#1e3a8a');
    expect(css).toContain('#dc2626');
    expect(css).toContain('#991b1b');
  });
});
