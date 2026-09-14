/**
 * Wave 62 leftover after #293 — Juggle glow keyframe box-shadow from/to leftovers.
 * Distinct from wave60 animation: juggle-glow name. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 62 juggle — inject glow keyframes', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects juggle-glow from/to gold box-shadows', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toContain('0 0 10px rgba(255,215,0,0.5)');
    expect(css).toContain('0 0 20px rgba(255,215,0,0.8)');
    expect(css).toMatch(/@keyframes juggle-glow/);
  });
});
