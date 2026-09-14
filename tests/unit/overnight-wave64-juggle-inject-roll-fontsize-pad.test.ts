/**
 * Wave 64 leftover after tip/#303 — Juggle inject roll-btn fontsize/pad.
 * Wave63 locked gradient; deepen 1.25rem / 1rem 2rem leftovers. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject roll fontsize pad', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects roll-btn padding 1rem 2rem and font-size 1.25rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-roll-btn\s*\{[^}]*padding:\s*1rem 2rem/
    );
    expect(css).toMatch(
      /\.juggle-roll-btn\s*\{[^}]*font-size:\s*1\.25rem/
    );
  });
});
