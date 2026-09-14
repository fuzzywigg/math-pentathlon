/**
 * Wave 56 leftover after #256 — Sum inject .sd-cell-valid cursor:pointer CSS.
 * Distinct from Blue/Red inject name leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

describe('Wave 56 sum — inject valid cursor CSS', () => {
  beforeEach(() => {
    document.getElementById('sd-styles')?.remove();
  });

  it('embeds .sd-cell-valid and .sd-hand-domino-playable cursor pointer', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-cell-valid\s*\{[^}]*cursor:\s*pointer/s);
    expect(css).toMatch(/\.sd-hand-domino-playable/);
    expect(css).toMatch(/cursor:\s*pointer/);
  });
});
