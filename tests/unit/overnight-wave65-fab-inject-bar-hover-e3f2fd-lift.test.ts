/**
 * Wave 65 leftover after tip/#305 — Fab bar hover #e3f2fd + translateY.
 * Soft tokens existed; lock hover selector pair leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 65 fab — inject bar hover e3f2fd lift', () => {
  it('enabled bar hover fills #e3f2fd and lifts 2px', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-bar-wrapper:not\(\.fab-bar-disabled\):hover\s*\{[\s\S]*?background:\s*#e3f2fd[\s\S]*?transform:\s*translateY\(-2px\)/
    );
  });
});
