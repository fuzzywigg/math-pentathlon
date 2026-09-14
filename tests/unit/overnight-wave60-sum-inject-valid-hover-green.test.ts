/**
 * Wave 60 leftover after #282 — Sum valid hover green. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 60 sum — inject valid hover green', () => {
  it('pins hover #4caf50 leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-cell-valid:hover\s*\{[\s\S]*?background:\s*#4caf50/);
  });
});
