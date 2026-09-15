/**
 * Wave 67 leftover after tip/#316 — Sum playable hover -2px leftover.
 * Soft selected -4 existed; lock playable:hover translateY(-2px). Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject playable hover -2', () => {
  it('pins hand-domino-playable:hover translateY(-2px) leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino-playable:hover\s*\{[\s\S]*?translateY\(-2px\)/
    );
  });
});
