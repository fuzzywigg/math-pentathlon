/**
 * Wave 65 leftover after tip/#305 — Fab primary hover #1976d2 scoped.
 * Soft #1976d2 existed; lock .fab-btn-primary:hover leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 65 fab — inject primary hover 1976', () => {
  it('primary hover fills #1976d2', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-btn-primary:hover\s*\{[\s\S]*?background:\s*#1976d2/
    );
  });
});
