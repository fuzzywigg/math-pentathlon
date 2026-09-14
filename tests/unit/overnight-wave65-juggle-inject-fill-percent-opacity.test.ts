/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Juggle fill-percent opacity.
 * Soft font-size 0.9rem elsewhere; lock opacity 0.8 leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject fill-percent opacity', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .fill-percent opacity 0.8 leftover', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.fill-percent\s*\{[^}]*opacity:\s*0\.8/);
  });
});
