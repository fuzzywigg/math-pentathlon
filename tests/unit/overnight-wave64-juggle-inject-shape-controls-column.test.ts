/**
 * Wave 64 leftover after tip/#303 — Juggle inject shape-controls column.
 * Unsaturated .juggle-shape-controls leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject shape-controls column', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects shape-controls column align-center gap pad', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-shape-controls\s*\{[^}]*flex-direction:\s*column/
    );
    expect(css).toMatch(
      /\.juggle-shape-controls\s*\{[^}]*align-items:\s*center/
    );
    expect(css).toMatch(/\.juggle-shape-controls\s*\{[^}]*gap:\s*0\.75rem/);
    expect(css).toMatch(/\.juggle-shape-controls\s*\{[^}]*padding:\s*1rem/);
  });
});
