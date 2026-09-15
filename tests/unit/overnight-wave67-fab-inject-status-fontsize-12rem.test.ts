/**
 * Wave 67 leftover after tip/#336 — Fab status font-size 1.2rem.
 * Wave61 align/weight; lock font-size 1.2rem leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject status fontsize 1.2rem', () => {
  it('status uses font-size 1.2rem', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(/\.fab-status\s*\{[\s\S]*?font-size:\s*1\.2rem/);
  });
});
