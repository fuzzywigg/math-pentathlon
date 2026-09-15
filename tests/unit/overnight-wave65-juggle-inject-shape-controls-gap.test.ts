/**
 * Wave 65 leftover after tip/#315 — Juggle inject shape-controls gap 0.75rem.
 * Wave64 locked column; gap leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject shape-controls gap', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-shape-controls gap 0.75rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-shape-controls\s*\{[^}]*gap:\s*0\.75rem/
    );
  });
});
