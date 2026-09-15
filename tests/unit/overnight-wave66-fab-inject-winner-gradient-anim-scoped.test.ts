/**
 * Wave 66 leftover after tip/#316 — Fab winner gradient + fab-glow anim scoped.
 * Wave63 soft gradient; lock banner animation leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject winner gradient anim scoped', () => {
  it('winner banner uses shorthand gold gradient and fab-glow', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-winner-banner\s*\{[\s\S]*?background:\s*linear-gradient\(135deg, #ffd700, #ffec8b\)[\s\S]*?animation:\s*fab-glow 1s ease-in-out infinite alternate/
    );
  });
});
