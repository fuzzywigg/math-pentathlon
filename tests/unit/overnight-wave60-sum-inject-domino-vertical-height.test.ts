/**
 * Wave 60 leftover after #282 — Sum vertical domino height/flex. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 60 sum — inject domino vertical height', () => {
  it('pins height and flex-direction leftovers', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-domino-vertical\s*\{[\s\S]*?flex-direction:\s*column/);
    expect(css).toMatch(/\.sd-domino-vertical\s*\{[\s\S]*?height:\s*44px/);
  });
});
