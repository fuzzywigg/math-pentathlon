/**
 * Wave 56 leftover after #256 — Juggle inject active board border #ffc107.
 * Distinct from wave55 glow/preview CSS leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 56 juggle — inject active border', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('embeds .juggle-board.active border-color #ffc107', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-board\.active/);
    expect(css).toMatch(/border-color:\s*#ffc107/);
    expect(css).toMatch(/\.juggle-roll-btn/);
    expect(css).toMatch(/#ff9800/);
  });
});
