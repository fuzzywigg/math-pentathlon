/**
 * Wave 66 leftover after tip/#316 — Fab op-btn hover border #ff9800 scoped.
 * Soft selected token existed; lock hover border-color leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject op hover border ff9800', () => {
  it('op-btn hover borders #ff9800', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-op-btn:hover:not\(:disabled\)\s*\{[\s\S]*?border-color:\s*#ff9800/
    );
  });
});
