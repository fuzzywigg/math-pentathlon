/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Juggle shape-header margin.
 * Soft font-weight 500 elsewhere; lock margin-bottom 0.75rem. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject shape-header mb', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-shape-header margin-bottom 0.75rem leftover', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-shape-header\s*\{[^}]*margin-bottom:\s*0\.75rem/
    );
  });
});
