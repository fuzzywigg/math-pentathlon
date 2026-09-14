/**
 * Wave 56 leftover after #256 — Juggle inject active border + 28px cells.
 * Distinct from wave55 glow/media leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 56 juggle — inject active border cell size', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('includes #ffc107 active border and 28px cell size', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-board\.active/);
    expect(css).toMatch(/#ffc107/);
    expect(css).toMatch(/width:\s*28px/);
    expect(css).toMatch(/height:\s*28px/);
    expect(css).toMatch(/\.juggle-status\.player1/);
    expect(css).toMatch(/\.juggle-status\.player2/);
  });
});
