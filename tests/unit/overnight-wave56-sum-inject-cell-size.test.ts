/**
 * Wave 56 leftover after #243 — Sum Dominoes inject 22px cell residual.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => document.getElementById('sd-styles')?.remove());

describe('Wave 56 sum — inject cell size', () => {
  it('pins .sd-cell to 22px square', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')!.textContent!;
    expect(css).toMatch(/\.sd-cell\s*\{[\s\S]*?width:\s*22px/);
    expect(css).toMatch(/\.sd-cell\s*\{[\s\S]*?height:\s*22px/);
  });
});
