/**
 * Wave 64 leftover after tip/#303 — Sum valid cell cursor pointer.
 * Soft valid light/hover greens existed; lock cursor pointer. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 64 sum — inject valid cursor pointer', () => {
  it('pins .sd-cell-valid cursor pointer leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-cell-valid\s*\{[\s\S]*?cursor:\s*pointer/);
  });
});
