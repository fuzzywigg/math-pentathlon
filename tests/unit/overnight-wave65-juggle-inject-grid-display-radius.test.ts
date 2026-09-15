/**
 * Wave 65 leftover after tip/#315 — Juggle inject grid display/radius.
 * Wave63 locked gap/bg/padding; deepen display/radius. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject grid display radius', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-grid display grid + border-radius 4px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-grid\s*\{[^}]*display:\s*grid/);
    expect(css).toMatch(/\.juggle-grid\s*\{[^}]*border-radius:\s*4px/);
  });
});
