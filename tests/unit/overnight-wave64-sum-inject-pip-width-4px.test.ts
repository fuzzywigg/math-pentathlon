/**
 * Wave 64 leftover after tip/#303 — Sum pip width 4px.
 * Wave60 locked height/black/radius; deepen width leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 64 sum — inject pip width 4px', () => {
  it('pins .sd-pip width 4px leftover', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-pip\s*\{[\s\S]*?width:\s*4px/);
  });
});
