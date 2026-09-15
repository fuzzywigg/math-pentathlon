/**
 * Wave 65 leftover after tip/#315 — Juggle inject shape-option gap/white.
 * Border #ddd + hover locked; deepen gap/white/cursor. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject shape option gap white', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects shape-option gap 0.25rem, white bg, cursor pointer', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-shape-option\s*\{[^}]*gap:\s*0\.25rem/);
    expect(css).toMatch(/\.juggle-shape-option\s*\{[^}]*background:\s*white/);
    expect(css).toMatch(/\.juggle-shape-option\s*\{[^}]*cursor:\s*pointer/);
  });
});
