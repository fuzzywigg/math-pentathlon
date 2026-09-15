/**
 * Wave 65 leftover after tip/#315 — Juggle inject roll-btn white/border-none.
 * Pad/font/gradient locked; deepen white/border/cursor/bold. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject roll btn white border none', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects roll-btn white color, border none, cursor pointer, bold', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-roll-btn\s*\{[^}]*color:\s*white/);
    expect(css).toMatch(/\.juggle-roll-btn\s*\{[^}]*border:\s*none/);
    expect(css).toMatch(/\.juggle-roll-btn\s*\{[^}]*cursor:\s*pointer/);
    expect(css).toMatch(/\.juggle-roll-btn\s*\{[^}]*font-weight:\s*bold/);
  });
});
