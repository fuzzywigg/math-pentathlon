/**
 * Wave 63 leftover after tip/#301 — Juggle fill-percent opacity leftover.
 * Complements fill-percent render % tests. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 63 juggle — inject fill opacity', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .fill-percent font-size 0.9rem and opacity 0.8', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.fill-percent\s*\{[^}]*font-size:\s*0\.9rem/);
    expect(css).toMatch(/\.fill-percent\s*\{[^}]*opacity:\s*0\.8/);
  });
});
