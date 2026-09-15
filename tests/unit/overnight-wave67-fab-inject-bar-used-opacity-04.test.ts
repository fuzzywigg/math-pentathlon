/**
 * Wave 67 leftover after tip/#316 — Fab bar-used opacity 0.4.
 * Soft used class; lock opacity 0.4 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject bar-used opacity 0.4', () => {
  it('bar-used sets opacity 0.4', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(/\.fab-bar-used\s*\{[\s\S]*?opacity:\s*0\.4/);
  });
});
