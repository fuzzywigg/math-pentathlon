/**
 * Wave 68 leftover after tip/#337 — Sum pip position absolute.
 * Soft 4px/translate existed; lock position leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 68 sum — inject pip position absolute', () => {
  it('pins leftover inject chrome', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-pip\s*\{[\s\S]*?position:\s*absolute/);
  });
});
