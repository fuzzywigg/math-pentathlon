/**
 * Wave 59 leftover after #279 — Juggle winner banner gold gradient stops.
 * Distinct from wave55 glow keyframes. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 59 juggle — inject winner gold gradient', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects gold gradient on .juggle-winner-banner', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toContain('.juggle-winner-banner');
    expect(css).toContain('linear-gradient(135deg, #ffd700, #ffec8b)');
  });
});
