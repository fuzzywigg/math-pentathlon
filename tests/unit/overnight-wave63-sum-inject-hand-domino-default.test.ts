/**
 * Wave 63 Contig/SD residual after tip #301 — Sum hand-domino default chrome leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 63 sum — inject hand-domino default', () => {
  it('pins cursor default, pad, radius, transition leftovers', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-hand-domino\s*\{[\s\S]*?cursor:\s*default/);
    expect(css).toMatch(/\.sd-hand-domino\s*\{[\s\S]*?padding:\s*2px/);
    expect(css).toMatch(/\.sd-hand-domino\s*\{[\s\S]*?border-radius:\s*6px/);
    expect(css).toMatch(/\.sd-hand-domino\s*\{[\s\S]*?transition:\s*all 0\.15s ease/);
  });
});
