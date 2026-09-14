/**
 * Wave 60 leftover after #282 — Sum domino cream/border/shadow. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 60 sum — inject domino cream tokens', () => {
  it('pins cream fill border shadow leftovers', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-domino\s*\{[\s\S]*?background:\s*#f5f5dc/);
    expect(css).toMatch(/\.sd-domino\s*\{[\s\S]*?border:\s*2px solid #333/);
    expect(css).toMatch(/\.sd-domino\s*\{[\s\S]*?box-shadow:\s*1px 1px 3px/);
  });
});
