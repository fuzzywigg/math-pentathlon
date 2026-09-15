/**
 * Wave 65 leftover after tip/#315 — Juggle inject shape-selector margin auto.
 * Wave63 locked max-width 500; margin auto leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject shape-selector margin auto', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-shape-selector margin 0 auto', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-shape-selector\s*\{[^}]*margin:\s*0\s+auto/
    );
  });
});
