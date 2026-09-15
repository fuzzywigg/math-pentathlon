/**
 * Wave 67 leftover after tip/#324 — Sum hand-domino cream background.
 * Soft pad/cursor / radius 6 existed; lock #f5f5dc leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject hand-domino cream bg', () => {
  it('pins sd-hand-domino background #f5f5dc leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino\s*\{[\s\S]*?background:\s*#f5f5dc/
    );
  });
});
