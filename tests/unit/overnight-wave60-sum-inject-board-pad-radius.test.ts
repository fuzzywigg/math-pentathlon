/**
 * Wave 60 leftover after #282 — Sum board pad/radius inject. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 60 sum — inject board pad radius', () => {
  it('pins padding and border-radius leftovers', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-board\s*\{[\s\S]*?padding:\s*8px/);
    expect(css).toMatch(/\.sd-board\s*\{[\s\S]*?border-radius:\s*8px/);
  });
});
