/**
 * Wave 67 leftover after tip/#323/#324 — shape-option border #ddd + pad.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject shape-option border ddd', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects shape-option #ddd border and pad 0.5rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-shape-option\s*\{[^}]*border:\s*2px solid #ddd/);
    expect(css).toMatch(/\.juggle-shape-option\s*\{[^}]*padding:\s*0\.5rem/);
    expect(css).toMatch(/\.juggle-shape-option\s*\{[^}]*cursor:\s*pointer/);
  });
});
