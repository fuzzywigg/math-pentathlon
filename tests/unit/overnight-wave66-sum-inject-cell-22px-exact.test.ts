/**
 * Wave 66 leftover after tip/#316 — Sum cell 22px dims leftover.
 * Soft cell greens/border existed; lock width/height 22px. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 66 sum — inject cell 22px', () => {
  it('pins sd-cell width/height 22px leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-cell\s*\{[\s\S]*?width:\s*22px/);
    expect(css).toMatch(/\.sd-cell\s*\{[\s\S]*?height:\s*22px/);
  });
});
