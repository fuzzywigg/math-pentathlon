/**
 * Wave 68 leftover after tip/#337 — Sum hand display flex.
 * Soft pad/gap/radius existed; lock display flex leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectSDStyles } from '../../src/games/sum-dominoes/board-ui';

afterEach(() => {
  document.getElementById('sd-styles')?.remove();
});

describe('Wave 68 sum — inject hand display flex', () => {
  it('pins leftover inject chrome', () => {
    injectSDStyles();
    const css = document.getElementById('sd-styles')?.textContent ?? '';
    expect(css).toMatch(/\.sd-hand\s*\{[\s\S]*?display:\s*flex/);
  });
});
