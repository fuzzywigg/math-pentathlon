/**
 * Wave 67 leftover after tip/#316 — Juggle active-board #ffc107 border.
 * Soft active class existed; lock border-color leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject board active ffc107', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-board.active border-color #ffc107', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-board\.active\s*\{[^}]*border-color:\s*#ffc107/
    );
  });
});
