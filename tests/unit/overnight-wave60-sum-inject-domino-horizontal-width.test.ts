/**
 * Wave 60 leftover after #282 — Sum horizontal domino width/flex. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 60 sum — inject domino horizontal width', () => {
  it('pins width and flex-direction leftovers', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-domino-horizontal\s*\{[\s\S]*?flex-direction:\s*row/);
    expect(css).toMatch(/\.sd-domino-horizontal\s*\{[\s\S]*?width:\s*44px/);
  });
});
