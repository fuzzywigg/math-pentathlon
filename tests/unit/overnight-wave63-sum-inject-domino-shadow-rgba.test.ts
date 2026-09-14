/**
 * Wave 63 Contig/SD residual after tip #301 — Sum domino shadow rgba leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 63 sum — inject domino shadow rgba', () => {
  it('pins 1px 1px 3px rgba(0,0,0,0.2) leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-domino\s*\{[\s\S]*?box-shadow:\s*1px 1px 3px rgba\(0,0,0,0\.2\)/
    );
  });
});
