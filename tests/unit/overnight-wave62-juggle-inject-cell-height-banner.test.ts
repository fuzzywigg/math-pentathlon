/**
 * Wave 62 leftover after #293 — Juggle cell height 28px + winner banner font.
 * Complements wave58 cell width 28px and wave59 winner gold. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 62 juggle — inject cell height banner', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects cell height 28px and winner-banner font-size 1.5rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-cell\s*\{[^}]*height:\s*28px/);
    expect(css).toMatch(
      /\.juggle-winner-banner\s*\{[^}]*font-size:\s*1\.5rem/
    );
  });
});
