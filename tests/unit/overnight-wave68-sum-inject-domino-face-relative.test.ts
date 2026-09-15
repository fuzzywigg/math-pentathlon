/**
 * Wave 68 leftover after tip/#337 — Sum domino-face position relative.
 * Soft flex:1 nearby; lock position relative leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 68 sum — inject domino-face relative', () => {
  it('pins leftover inject chrome', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-domino-face\s*\{[\s\S]*?position:\s*relative/);
  });
});
