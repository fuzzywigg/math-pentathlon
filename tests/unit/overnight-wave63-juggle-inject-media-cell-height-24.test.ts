/**
 * Wave 63 leftover after tip/#301 — Juggle media cell height 24px.
 * Wave55 locked width 24px + max-width 700; deepen height. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 63 juggle — inject media cell height 24', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects media-query .juggle-cell height 24px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/@media \(max-width: 700px\)/);
    expect(css).toMatch(/\.juggle-cell\s*\{[^}]*height:\s*24px/);
  });
});
