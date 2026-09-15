/**
 * Wave 67 leftover after tip/#324 — Sum sd-domino border-radius 4px.
 * Soft cream / #333 border / shadow existed; lock radius leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject domino radius 4', () => {
  it('pins sd-domino border-radius 4px leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-domino\s*\{[\s\S]*?border-radius:\s*4px/);
  });
});
