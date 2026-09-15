/**
 * Wave 67 leftover after tip/#323/#324 — current-shape pad + radius.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject current-shape pad radius', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects current-shape pad 0.5rem and radius 8px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-current-shape\s*\{[^}]*padding:\s*0\.5rem/);
    expect(css).toMatch(/\.juggle-current-shape\s*\{[^}]*border-radius:\s*8px/);
  });
});
