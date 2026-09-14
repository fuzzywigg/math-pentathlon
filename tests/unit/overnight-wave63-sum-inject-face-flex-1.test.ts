/**
 * Wave 63 Contig/SD residual after tip #301 — Sum domino-face flex leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 63 sum — inject face flex 1', () => {
  it('pins .sd-domino-face position/flex leftovers', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-domino-face\s*\{[\s\S]*?position:\s*relative/);
    expect(css).toMatch(/\.sd-domino-face\s*\{[\s\S]*?flex:\s*1/);
  });
});
