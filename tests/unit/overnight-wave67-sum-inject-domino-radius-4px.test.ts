/**
 * Wave 67 leftover after tip/#316 — Sum board-domino radius 4px leftover.
 * Soft cream/shadow tokens existed; lock border-radius 4px leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject domino radius 4px', () => {
  it('pins sd-domino border-radius 4px + display flex', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-domino\s*\{[\s\S]*?border-radius:\s*4px/);
    expect(css).toMatch(/\.sd-domino\s*\{[\s\S]*?display:\s*flex/);
  });
});
