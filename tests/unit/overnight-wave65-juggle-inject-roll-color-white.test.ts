/**
 * Wave 65 leftover after tip/#315 — Juggle inject roll-btn color white.
 * Wave63 locked gradient; color white leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject roll color white', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-roll-btn color white', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-roll-btn\s*\{[^}]*color:\s*white/);
  });
});
