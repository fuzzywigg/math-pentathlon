/**
 * Wave 60 leftover after #282 — Sum valid light green. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 60 sum — inject valid light green', () => {
  it('pins #81c784 leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-cell-valid\s*\{[\s\S]*?background:\s*#81c784/);
  });
});
