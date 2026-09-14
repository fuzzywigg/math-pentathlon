/**
 * Wave 60 leftover after #282 — Sum playable hover lift. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 60 sum — inject playable hover lift', () => {
  it('pins translateY(-2px) leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino-playable:hover\s*\{[\s\S]*?translateY\(-2px\)/
    );
  });
});
