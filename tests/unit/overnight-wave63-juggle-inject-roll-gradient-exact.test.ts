/**
 * Wave 63 leftover after tip/#301 — Juggle roll-btn gradient exact full string.
 * Wave58 locked #ff9800/#f57c00 separately; lock full linear-gradient. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 63 juggle — inject roll gradient exact', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects exact orange linear-gradient on .juggle-roll-btn', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toContain(
      'linear-gradient(135deg, #ff9800, #f57c00)'
    );
  });
});
