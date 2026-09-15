/**
 * Wave 65 leftover after tip/#315 — Juggle inject hint margin-top.
 * Wave62 locked font/color; margin-top leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject hint margin top', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-hint margin-top 0.5rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-hint\s*\{[^}]*margin-top:\s*0\.5rem/);
  });
});
