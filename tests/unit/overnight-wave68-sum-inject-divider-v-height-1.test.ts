/**
 * Wave 68 leftover after tip/#337 — Sum vertical divider height 1px.
 * Soft horizontal 1px existed; lock vertical height leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 68 sum — inject divider v height 1', () => {
  it('pins leftover inject chrome', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-domino-vertical \.sd-domino-divider\s*\{[\s\S]*?height:\s*1px/
    );
  });
});
