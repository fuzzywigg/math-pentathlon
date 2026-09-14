/**
 * Wave 62 leftover after #293 — Juggle roll-btn hover lift + pad/font leftovers.
 * Distinct from wave60 roll shadow and wave58 gradient. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 62 juggle — inject roll hover pad', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects roll-btn padding/font and hover translateY(-2px)', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-roll-btn\s*\{[^}]*padding:\s*1rem 2rem/);
    expect(css).toMatch(/\.juggle-roll-btn\s*\{[^}]*font-size:\s*1\.25rem/);
    expect(css).toMatch(
      /\.juggle-roll-btn:hover:not\(:disabled\)\s*\{[^}]*translateY\(-2px\)/
    );
  });
});
