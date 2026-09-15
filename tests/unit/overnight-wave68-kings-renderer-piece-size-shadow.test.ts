/**
 * Wave 68 leftover after tip/#336 — Kings renderer piece 80% + text-shadow. Tests-only.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createInitialBoard } from '../../src/games/kings-quadraphages/board';
import { renderBoard } from '../../src/games/kings-quadraphages/board-renderer';

describe('Wave 68 kings — renderer piece size shadow', () => {
  beforeEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });
  afterEach(() => {
    document.head.querySelectorAll('style[data-board-styles]').forEach((n) => n.remove());
  });

  it('piece width 80% + font-size 14px + text-shadow', () => {
    renderBoard(createInitialBoard());
    const css = document.querySelector('style[data-board-styles]')?.textContent ?? '';
    expect(css).toMatch(/\.piece\s*\{[^}]*width:\s*80%/s);
    expect(css).toMatch(/\.piece\s*\{[^}]*font-size:\s*14px/s);
    expect(css).toContain('text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5)');
  });
});
