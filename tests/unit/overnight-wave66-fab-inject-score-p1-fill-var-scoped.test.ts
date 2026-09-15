/**
 * Wave 66 leftover after tip/#316 — Fab score-p1 fill+var scoped.
 * Wave61 soft fill/var; lock .fab-score-p1 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject score-p1 fill var scoped', () => {
  it('score-p1 uses #bbdefb and player1 color var', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-score-p1\s*\{[\s\S]*?background:\s*#bbdefb[\s\S]*?color:\s*var\(--color-player1, #2196f3\)/
    );
  });
});
