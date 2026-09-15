/**
 * Wave 67 leftover after tip/#324 — Sum sd-board border-radius 8px.
 * Soft shadow 0.3 / pad 8 existed; lock radius leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject board radius 8 exact', () => {
  it('pins sd-board border-radius 8px leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-board\s*\{[\s\S]*?border-radius:\s*8px/);
  });
});
