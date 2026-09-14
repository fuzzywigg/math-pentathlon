/**
 * Wave 56 leftover after #256 — Juggle active board border CSS.
 * Distinct from wave55 glow + media 700. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 56 juggle — inject active border', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-board.active border-color #ffc107', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-board\.active/);
    expect(css).toMatch(/#ffc107/);
  });
});
