/**
 * Wave 63 Contig/SD residual after tip #301 — Sum board shadow rgba leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 63 sum — inject board shadow rgba', () => {
  it('pins rgba(0,0,0,0.3) board shadow leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-board\s*\{[\s\S]*?box-shadow:\s*0 4px 12px rgba\(0,0,0,0\.3\)/
    );
  });
});
