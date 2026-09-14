/**
 * Wave 60 leftover after #282 — Sum hand-domino size/radius. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 60 sum — inject hand-domino size', () => {
  it('pins width height radius leftovers', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-hand-domino\s*\{[\s\S]*?width:\s*40px/);
    expect(css).toMatch(/\.sd-hand-domino\s*\{[\s\S]*?height:\s*20px/);
    expect(css).toMatch(/\.sd-hand-domino\s*\{[\s\S]*?border-radius:\s*6px/);
  });
});
