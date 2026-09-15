/**
 * Wave 68 leftover after tip/#336 — Kings renderer board 450×450. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

describe('Wave 68 kings — renderer board size 450', () => {
  beforeEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });
  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  it('game-board width/height 450px exact', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toMatch(/\.game-board\s*\{[^}]*width:\s*450px/s);
    expect(css).toMatch(/\.game-board\s*\{[^}]*height:\s*450px/s);
  });
});
