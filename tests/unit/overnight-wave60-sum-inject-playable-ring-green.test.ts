/**
 * Wave 60 leftover after #282 — Sum playable green ring. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 60 sum — inject playable ring green', () => {
  it('pins 0 0 0 2px #4caf50 leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino-playable\s*\{[\s\S]*?box-shadow:\s*0 0 0 2px #4caf50/
    );
  });
});
