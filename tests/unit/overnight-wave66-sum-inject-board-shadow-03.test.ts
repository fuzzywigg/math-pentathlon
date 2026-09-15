/**
 * Wave 66 leftover after tip/#316 — Sum board box-shadow 0.3.
 * Soft board greens/pad existed; lock rgba(0,0,0,0.3) leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 66 sum — inject board shadow 0.3', () => {
  it('pins sd-board box-shadow rgba(0,0,0,0.3) leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-board\s*\{[\s\S]*?box-shadow:\s*0 4px 12px rgba\(0,0,0,0\.3\)/
    );
  });
});
