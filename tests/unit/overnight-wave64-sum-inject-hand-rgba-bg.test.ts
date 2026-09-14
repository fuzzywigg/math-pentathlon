/**
 * Wave 64 leftover after tip/#303 — Sum hand rgba white 0.1 bg.
 * Soft hand max-width/gap existed; lock rgba bg leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 64 sum — inject hand rgba bg', () => {
  it('pins hand background rgba(255,255,255,0.1) leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand\s*\{[\s\S]*?background:\s*rgba\(255,255,255,0\.1\)/
    );
  });
});
