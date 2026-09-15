/**
 * Wave 68 leftover after tip/#337 — Sum hand-domino flex-direction row.
 * Soft cream/border existed; lock row leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 68 sum — inject hand-domino row', () => {
  it('pins leftover inject chrome', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino\s*\{[\s\S]*?flex-direction:\s*row/
    );
  });
});
