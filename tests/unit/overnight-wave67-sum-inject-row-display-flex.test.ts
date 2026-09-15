/**
 * Wave 67 leftover after tip/#324 — Sum sd-row display flex.
 * Soft cell 22px existed; lock row flex leftover. Tests-only.
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
