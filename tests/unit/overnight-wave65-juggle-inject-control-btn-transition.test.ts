/**
 * Wave 65 leftover after tip/#315 — Juggle inject control-btn transition.
 * Wave64 locked radius; transition background leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject control-btn transition', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-control-btn transition background 0.15s', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-control-btn\s*\{[^}]*transition:\s*background\s+0\.15s/
    );
  });
});
