/**
 * Wave 62 leftover after #293 — Juggle board chrome gap/radius/transparent border.
 * Distinct from wave60 #f5f5f5 bg and wave56 active #ffc107. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 62 juggle — inject board chrome', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects boards gap 2rem and board radius/transparent border', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-boards\s*\{[^}]*gap:\s*2rem/);
    expect(css).toMatch(/\.juggle-board\s*\{[^}]*border-radius:\s*12px/);
    expect(css).toMatch(
      /\.juggle-board\s*\{[^}]*border:\s*3px solid transparent/
    );
  });
});
