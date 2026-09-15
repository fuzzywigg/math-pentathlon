/**
 * Wave 67 leftover after tip/#316 — FIAR board-container flex center.
 * Wave61 pad soft; lock display flex + justify center leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 fiar — inject board-container flex center', () => {
  it('board-container is flex centered with pad 1rem', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-board-container\s*\{[\s\S]*?display:\s*flex[\s\S]*?justify-content:\s*center[\s\S]*?padding:\s*1rem/
    );
  });
});
