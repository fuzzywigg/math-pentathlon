/**
 * Wave 68 leftover after tip/#337 — Sum hand-domino border-radius 6px.
 * Soft board domino 4px existed; lock hand 6px leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 68 sum — inject hand-domino radius 6', () => {
  it('pins leftover inject chrome', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino\s*\{[\s\S]*?border-radius:\s*6px/
    );
  });
});
