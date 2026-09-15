/**
 * Wave 68 leftover after tip/#337 — Sum hand-domino height 20px.
 * Soft width 40px existed; lock height leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 68 sum — inject hand-domino height 20', () => {
  it('pins leftover inject chrome', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-hand-domino\s*\{[\s\S]*?height:\s*20px/);
  });
});
