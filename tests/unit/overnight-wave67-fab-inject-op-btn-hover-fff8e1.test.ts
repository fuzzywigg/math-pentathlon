/**
 * Wave 67 leftover after tip/#316 — Fab op-btn hover #fff8e1 scoped.
 * Wave55 soft #fff8e1; lock .fab-op-btn:hover leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject op-btn hover fff8e1', () => {
  it('op-btn hover fills #fff8e1 when enabled', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-op-btn:hover:not\(:disabled\)\s*\{[\s\S]*?background:\s*#fff8e1/
    );
  });
});
