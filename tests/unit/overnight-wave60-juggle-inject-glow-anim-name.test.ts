/**
 * Wave 60 leftover after tip/#279 — Juggle winner banner animation name.
 * Wave55 locked @keyframes only. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 60 juggle — inject glow anim name', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('applies animation: juggle-glow on winner banner', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-winner-banner\s*\{[^}]*animation:\s*juggle-glow/
    );
  });
});
