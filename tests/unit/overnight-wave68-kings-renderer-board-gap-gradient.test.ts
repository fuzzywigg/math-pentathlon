/**
 * Wave 68 leftover after tip/#336 — Kings renderer gap + sand gradient. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

describe('Wave 68 kings — renderer board gap gradient', () => {
  beforeEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });
  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  it('game-board gap 2px + f4a460 gradient', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toMatch(/\.game-board\s*\{[^}]*gap:\s*2px/s);
    expect(css).toContain('#f4a460');
    expect(css).toContain('#daa520');
  });
});
