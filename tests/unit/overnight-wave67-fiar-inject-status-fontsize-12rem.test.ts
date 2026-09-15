/**
 * Wave 67 leftover after tip/#336 — FIAR status font-size 1.2rem.
 * Wave61 weight soft; lock font-size 1.2rem leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 67 fiar — inject status fontsize 1.2rem', () => {
  it('status uses font-size 1.2rem', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(/\.fiar-status\s*\{[\s\S]*?font-size:\s*1\.2rem/);
  });
});
