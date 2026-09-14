/**
 * Wave 57 leftover after #262 — Juggle inject cell 28px size.
 * Distinct from wave55 media 24px and wave56 active border. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 57 juggle — inject cell 28px', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-cell width and height 28px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-cell\s*\{[^}]*width:\s*28px/);
    expect(css).toMatch(/\.juggle-cell\s*\{[^}]*height:\s*28px/);
  });
});
