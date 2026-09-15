/**
 * Wave 66 leftover after tip/#316 — Fab bar-selected ring scoped.
 * Wave58/63 soft ring + !important; lock selector pair leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject bar-selected ring scoped', () => {
  it('selected bar uses #fff3e0 !important and #ff9800 ring', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-bar-selected\s*\{[\s\S]*?background:\s*#fff3e0 !important[\s\S]*?box-shadow:\s*0 0 0 2px #ff9800/
    );
  });
});
