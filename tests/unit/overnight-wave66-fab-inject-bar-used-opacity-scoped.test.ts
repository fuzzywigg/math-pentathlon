/**
 * Wave 66 leftover after tip/#316 — Fab bar-used opacity scoped.
 * Wave59 soft opacity 0.4; lock .fab-bar-used leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject bar-used opacity scoped', () => {
  it('bar-used sets opacity 0.4', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(/\.fab-bar-used\s*\{[\s\S]*?opacity:\s*0\.4/);
  });
});
