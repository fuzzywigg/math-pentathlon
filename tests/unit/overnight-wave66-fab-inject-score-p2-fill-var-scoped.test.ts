/**
 * Wave 66 leftover after tip/#316 — Fab score-p2 fill+var scoped.
 * Wave61 soft fill/var; lock .fab-score-p2 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject score-p2 fill var scoped', () => {
  it('score-p2 uses #ffcdd2 and player2 color var', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-score-p2\s*\{[\s\S]*?background:\s*#ffcdd2[\s\S]*?color:\s*var\(--color-player2, #f44336\)/
    );
  });
});
