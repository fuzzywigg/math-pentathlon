/**
 * Wave 64 leftover after tip/#303 — Juggle inject die-container column.
 * Soft die-container queries in render tests; lock inject CSS. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject die-container column', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects die-container column align-center gap 0.5rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-die-container\s*\{[^}]*flex-direction:\s*column/
    );
    expect(css).toMatch(
      /\.juggle-die-container\s*\{[^}]*align-items:\s*center/
    );
    expect(css).toMatch(/\.juggle-die-container\s*\{[^}]*gap:\s*0\.5rem/);
  });
});
