/**
 * Wave 67 leftover after tip/#324 — Sum hand-domino border #333.
 * Soft cream bg / pad existed; lock 2px #333 border leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject hand-domino border 333', () => {
  it('pins sd-hand-domino border 2px solid #333 leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino\s*\{[\s\S]*?border:\s*2px solid #333/
    );
  });
});
