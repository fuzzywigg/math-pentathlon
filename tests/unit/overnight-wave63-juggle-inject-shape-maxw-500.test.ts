/**
 * Wave 63 leftover after tip/#301 — Juggle shape-selector max-width 500.
 * Wave62 locked shape-option border #ddd; deepen selector max-width. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 63 juggle — inject shape maxw 500', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-shape-selector max-width 500px + margin auto', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-shape-selector\s*\{[^}]*max-width:\s*500px/
    );
    expect(css).toMatch(/\.juggle-shape-selector\s*\{[^}]*margin:\s*0 auto/);
  });
});
