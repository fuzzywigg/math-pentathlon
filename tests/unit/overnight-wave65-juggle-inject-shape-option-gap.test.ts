/**
 * Wave 65 leftover after tip/#315 — Juggle inject shape-option gap 0.25rem.
 * Wave60 locked hover; gap leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject shape-option gap', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-shape-option gap 0.25rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-shape-option\s*\{[^}]*gap:\s*0\.25rem/);
  });
});
