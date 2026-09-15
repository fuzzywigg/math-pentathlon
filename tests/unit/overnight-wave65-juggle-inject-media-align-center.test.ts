/**
 * Wave 65 leftover after tip/#315 — Juggle inject media boards align-items.
 * Wave63 locked cell height 24; media align leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject media align center', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects media .juggle-boards align-items center', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/@media \(max-width:\s*700px\)/);
    expect(css).toMatch(
      /\.juggle-boards\s*\{[^}]*align-items:\s*center/
    );
  });
});
