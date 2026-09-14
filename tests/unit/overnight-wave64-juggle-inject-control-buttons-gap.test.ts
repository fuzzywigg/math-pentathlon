/**
 * Wave 64 leftover after tip/#303 — Juggle inject control-buttons gap.
 * Unsaturated .juggle-control-buttons leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject control-buttons gap', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-control-buttons flex gap 0.5rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-control-buttons\s*\{[^}]*display:\s*flex/);
    expect(css).toMatch(/\.juggle-control-buttons\s*\{[^}]*gap:\s*0\.5rem/);
  });
});
