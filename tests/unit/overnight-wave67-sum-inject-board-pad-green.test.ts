/**
 * Wave 67 leftover after tip/#316 — Sum board pad/green leftover.
 * Soft shadow 0.3 existed; lock #2d5a27 + pad 8px + radius 8px. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject board pad green', () => {
  it('pins sd-board #2d5a27 + padding 8px + radius 8px', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-board\s*\{[\s\S]*?background:\s*#2d5a27/);
    expect(css).toMatch(/\.sd-board\s*\{[\s\S]*?padding:\s*8px/);
    expect(css).toMatch(/\.sd-board\s*\{[\s\S]*?border-radius:\s*8px/);
  });
});
