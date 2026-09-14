/**
 * Wave 60 leftover after tip/#279 — Juggle shape-option hover green tokens.
 * Distinct from #289 tromino names. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 60 juggle — inject shape hover', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects shape-option:hover #4caf50 border and #e8f5e9 bg', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-shape-option:hover\s*\{[^}]*border-color:\s*#4caf50/
    );
    expect(css).toMatch(
      /\.juggle-shape-option:hover\s*\{[^}]*background:\s*#e8f5e9/
    );
  });
});
