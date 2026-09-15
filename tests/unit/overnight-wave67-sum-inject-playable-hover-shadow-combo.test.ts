/**
 * Wave 67 leftover after tip/#324 — Sum playable:hover shadow combo.
 * Soft translateY(-2px) existed; lock dual box-shadow leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 67 sum — inject playable hover shadow combo', () => {
  it('pins playable:hover 0 2px 8px + valid ring leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.sd-hand-domino-playable:hover\s*\{[\s\S]*?box-shadow:\s*0 2px 8px rgba\(0,0,0,0\.2\), 0 0 0 2px #4caf50/
    );
  });
});
