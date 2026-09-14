/**
 * Wave 63 leftover after tip/#301 — Juggle shape-header margin-bottom.
 * Complements shape header text locks. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 63 juggle — inject shape header margin', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-shape-header margin-bottom 0.75rem + font-weight 500', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-shape-header\s*\{[^}]*margin-bottom:\s*0\.75rem/
    );
    expect(css).toMatch(
      /\.juggle-shape-header\s*\{[^}]*font-weight:\s*500/
    );
  });
});
