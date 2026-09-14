/**
 * Wave 60 leftover after tip/#279 — Juggle die selectable hover scale(1.1).
 * Distinct from #289 die size chrome. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 60 juggle — inject die hover scale', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects selectable:hover transform scale(1.1)', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-die\.selectable:hover\s*\{[^}]*transform:\s*scale\(1\.1\)/
    );
  });
});
