/**
 * Wave 66 leftover after tip/#316 — FIAR winner-banner winner-glow anim scoped.
 * Wave59 soft keyframe bodies; lock banner animation leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 66 fiar — inject winner glow anim scoped', () => {
  it('winner banner animates with winner-glow alternate', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fiar-winner-banner\s*\{[\s\S]*?animation:\s*winner-glow 1s ease-in-out infinite alternate/
    );
  });
});
