/**
 * Wave 67 leftover after tip/#316 — Sum cell green/border leftover.
 * Soft 22px dims existed; lock #3d7a37 + 1px #1a3a17 border. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject cell green border', () => {
  it('pins sd-cell #3d7a37 + 1px #1a3a17 border leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-cell\s*\{[\s\S]*?background:\s*#3d7a37/);
    expect(css).toMatch(
      /\.sd-cell\s*\{[\s\S]*?border:\s*1px solid #1a3a17/
    );
  });
});
