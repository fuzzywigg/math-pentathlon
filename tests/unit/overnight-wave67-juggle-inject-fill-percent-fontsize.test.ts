/**
 * Wave 67 leftover after tip/#316 — Juggle fill-percent font-size 0.9rem.
 * Soft opacity 0.8 existed; lock font-size leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject fill-percent fontsize', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .fill-percent font-size 0.9rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.fill-percent\s*\{[^}]*font-size:\s*0\.9rem/);
  });
});
