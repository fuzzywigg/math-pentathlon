/**
 * Wave 64 leftover after tip/#303 — Sum cell border + board greens.
 * Soft cream/valid tokens existed; lock board/cell paint leftovers. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 64 sum — inject cell border board', () => {
  it('pins board #2d5a27 and cell border #1a3a17 leftovers', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-board\s*\{[\s\S]*?background:\s*#2d5a27/);
    expect(css).toMatch(
      /\.sd-cell\s*\{[\s\S]*?border:\s*1px solid #1a3a17/
    );
    expect(css).toMatch(/\.sd-cell\s*\{[\s\S]*?background:\s*#3d7a37/);
  });
});
