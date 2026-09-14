/**
 * Wave 63 leftover after tip/#301 — Juggle board-header space-between.
 * Complements board chrome gap/radius locks. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 63 juggle — inject header space-between', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects header justify-content space-between + margin-bottom', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-board-header\s*\{[^}]*justify-content:\s*space-between/
    );
    expect(css).toMatch(
      /\.juggle-board-header\s*\{[^}]*margin-bottom:\s*0\.5rem/
    );
  });
});
