/**
 * Wave 59 leftover after #279 — Juggle roll-btn disabled opacity CSS.
 * Distinct from wave58 roll gradient. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 59 juggle — inject roll disabled opacity', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects opacity 0.5 on .juggle-roll-btn:disabled', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toContain('.juggle-roll-btn:disabled');
    expect(css).toMatch(
      /\.juggle-roll-btn:disabled\s*\{[^}]*opacity:\s*0\.5/
    );
  });
});
