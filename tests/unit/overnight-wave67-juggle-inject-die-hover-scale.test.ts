/**
 * Wave 67 leftover after tip/#316 — Juggle die selectable hover scale.
 * Soft hover shadow existed; lock scale(1.1) leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject die hover scale', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects selectable die hover scale 1.1', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-die\.selectable:hover\s*\{[^}]*transform:\s*scale\(1\.1\)/
    );
  });
});
