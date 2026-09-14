/**
 * Wave 60 leftover after #282 — Sum selected lift/ring. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 60 sum — inject selected lift', () => {
  it('pins translateY(-4px) and 3px ring leftovers', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino-selected\s*\{[\s\S]*?0 0 0 3px #ff9800/
    );
    expect(css).toMatch(
      /\.sd-hand-domino-selected\s*\{[\s\S]*?translateY\(-4px\)/
    );
  });
});
