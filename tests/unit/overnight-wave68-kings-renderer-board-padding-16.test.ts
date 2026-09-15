/**
 * Wave 68 leftover after tip/#336 — Kings renderer board padding 16px. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

describe('Wave 68 kings — renderer board padding 16', () => {
  beforeEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });
  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  it('game-board padding 16px exact', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toMatch(/\.game-board\s*\{[^}]*padding:\s*16px/s);
  });
});
