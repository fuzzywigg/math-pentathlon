/**
 * Wave 66 leftover after tip/#316 — FIAR board-container flex+pad scoped.
 * Soft flex existed; lock .fiar-board-container leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 66 fiar — inject board-container flex pad', () => {
  it('board-container is flex centered with 1rem pad', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-board-container\s*\{[\s\S]*?display:\s*flex[\s\S]*?justify-content:\s*center[\s\S]*?padding:\s*1rem/
    );
  });
});
