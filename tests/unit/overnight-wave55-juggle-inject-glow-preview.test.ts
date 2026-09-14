/**
 * Wave 55 leftover after #250 — Juggle inject glow + preview colors.
 * Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 55 juggle — inject glow/preview', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('embeds winner glow keyframes and preview-valid/invalid fills', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/@keyframes juggle-glow/);
    expect(css).toMatch(/\.juggle-winner-banner/);
    expect(css).toMatch(/\.juggle-cell\.preview-valid/);
    expect(css).toMatch(/\.juggle-cell\.preview-invalid/);
    expect(css).toMatch(/occupied-player1/);
    expect(css).toMatch(/occupied-player2/);
  });
});
