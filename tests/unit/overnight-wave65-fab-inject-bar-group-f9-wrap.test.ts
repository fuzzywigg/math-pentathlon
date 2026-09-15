/**
 * Wave 65 leftover after tip/#305 — Fab bar-group #f9f9f9 + flex-wrap.
 * Soft transition existed; lock group bg + wrap leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 65 fab — inject bar group f9 wrap', () => {
  it('bar-group uses flex-wrap and #f9f9f9 background', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-bar-group\s*\{[\s\S]*?flex-wrap:\s*wrap[\s\S]*?background:\s*#f9f9f9/
    );
  });
});
