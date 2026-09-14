/**
 * Wave 64 leftover after tip/#303 — Juggle inject dice-display gap chrome.
 * Unsaturated .juggle-dice-display leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject dice-display gap', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-dice-display flex gap 2rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-dice-display\s*\{[^}]*display:\s*flex/);
    expect(css).toMatch(/\.juggle-dice-display\s*\{[^}]*gap:\s*2rem/);
  });
});
