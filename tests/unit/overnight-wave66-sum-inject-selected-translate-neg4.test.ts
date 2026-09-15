/**
 * Wave 66 leftover after tip/#316 — Sum selected translateY(-4px) leftover.
 * Soft selected ring/lift soft-matched; lock -4px translate exact. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 66 sum — inject selected translate -4', () => {
  it('pins hand-domino-selected translateY(-4px) leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino-selected\s*\{[\s\S]*?translateY\(-4px\)/
    );
    expect(css).toMatch(
      /\.sd-hand-domino-selected\s*\{[\s\S]*?0 0 0 3px #ff9800/
    );
  });
});
