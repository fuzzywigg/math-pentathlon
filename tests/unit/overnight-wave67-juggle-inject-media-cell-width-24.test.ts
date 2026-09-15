/**
 * Wave 67 leftover after tip/#316 — Juggle media cell width 24px.
 * Soft height 24 existed; lock width 24px leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject media cell width 24', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('700px media shrinks cell width to 24px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /@media \(max-width: 700px\)[\s\S]*?\.juggle-cell\s*\{[^}]*width:\s*24px/
    );
  });
});
