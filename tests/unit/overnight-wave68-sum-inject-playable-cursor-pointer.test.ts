/**
 * Wave 68 leftover after tip/#337 — Sum playable cursor pointer.
 * Soft green ring existed; lock cursor leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 68 sum — inject playable cursor pointer', () => {
  it('pins leftover inject chrome', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino-playable\s*\{[\s\S]*?cursor:\s*pointer/
    );
  });
});
