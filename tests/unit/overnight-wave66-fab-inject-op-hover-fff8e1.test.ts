/**
 * Wave 66 leftover after tip/#316 — Fab op-btn hover #fff8e1 scoped.
 * Wave55 soft #fff8e1; lock hover selector fill leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject op hover fff8e1', () => {
  it('op-btn hover fills #fff8e1', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-op-btn:hover:not\(:disabled\)\s*\{[\s\S]*?background:\s*#fff8e1/
    );
  });
});
