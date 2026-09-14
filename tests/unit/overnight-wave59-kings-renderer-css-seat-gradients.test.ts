/**
 * Wave 59 leftover after #276 — Kings board-renderer seat gradients + size. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

afterEach(() => {
  document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  document.body.innerHTML = '';
});

describe('Wave 59 kings — renderer seat gradients', () => {
  it('CSS pins daa520 gold mid, hover moccasin, P1/P2 seat gradients, 450px board', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('#daa520');
    expect(css).toContain('#ffe4b5');
    expect(css).toContain('#4169e1');
    expect(css).toContain('#1e3a8a');
    expect(css).toContain('#dc2626');
    expect(css).toContain('#991b1b');
    expect(css).toContain('width: 450px');
    expect(css).toContain('height: 450px');
  });
});
