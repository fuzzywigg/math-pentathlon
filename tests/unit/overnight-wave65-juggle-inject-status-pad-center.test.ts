/**
 * Wave 65 leftover after tip/#315 — Juggle inject status pad/center chrome.
 * Unsaturated .juggle-status leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject status pad center', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-status text-align center padding 1rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-status\s*\{[^}]*text-align:\s*center/);
    expect(css).toMatch(/\.juggle-status\s*\{[^}]*padding:\s*1rem/);
  });
});
