/**
 * Wave 67 leftover after tip/#316 — Sum row display flex leftover.
 * Soft cell/board pins existed; lock .sd-row display flex. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject row display flex', () => {
  it('pins sd-row display flex leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-row\s*\{[\s\S]*?display:\s*flex/);
  });
});
