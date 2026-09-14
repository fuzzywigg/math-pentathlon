/**
 * Wave 60 leftover after #282 — Sum hand max-width/bg. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 60 sum — inject hand maxwidth bg', () => {
  it('pins max-width and rgba bg leftovers', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-hand\s*\{[\s\S]*?max-width:\s*300px/);
    expect(css).toMatch(/rgba\(255,255,255,0\.1\)/);
  });
});
