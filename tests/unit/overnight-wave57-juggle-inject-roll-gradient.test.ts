/**
 * Wave 57 leftover after #262 — Juggle roll button gradient colors.
 * Distinct from active #ffc107. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 57 juggle — inject roll gradient', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects roll-btn orange gradient stops', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-roll-btn/);
    expect(css).toContain('#ff9800');
    expect(css).toContain('#f57c00');
  });
});
