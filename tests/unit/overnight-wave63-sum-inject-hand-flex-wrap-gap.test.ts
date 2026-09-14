/**
 * Wave 63 Contig/SD residual after tip #301 — Sum hand flex-wrap/gap leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 63 sum — inject hand flex-wrap gap', () => {
  it('pins flex-wrap and gap 0.5rem leftovers', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-hand\s*\{[\s\S]*?flex-wrap:\s*wrap/);
    expect(css).toMatch(/\.sd-hand\s*\{[\s\S]*?gap:\s*0\.5rem/);
  });
});
