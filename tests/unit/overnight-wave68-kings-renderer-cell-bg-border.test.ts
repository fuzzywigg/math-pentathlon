/**
 * Wave 68 leftover after tip/#336 — Kings renderer cell bg/border exact. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

describe('Wave 68 kings — renderer cell bg border', () => {
  beforeEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });
  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  it('cell bg ffecd2 + border 8b4513 + hover ffe4b5', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toContain('background-color: #ffecd2');
    expect(css).toContain('border: 1px solid #8b4513');
    expect(css).toContain('background-color: #ffe4b5');
  });
});
