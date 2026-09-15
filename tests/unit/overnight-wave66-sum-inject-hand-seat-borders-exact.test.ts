/**
 * Wave 66 leftover after tip/#316 — Sum hand seat border CSS vars.
 * Soft hand-player class refs existed; lock border player var exacts. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 66 sum — inject hand seat borders', () => {
  it('pins hand-player1/2 border CSS var leftovers', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-player1\s*\{[\s\S]*?border:\s*2px solid var\(--color-player1, #2196f3\)/
    );
    expect(css).toMatch(
      /\.sd-hand-player2\s*\{[\s\S]*?border:\s*2px solid var\(--color-player2, #f44336\)/
    );
  });
});
