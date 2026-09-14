/**
 * Wave 63 leftover after tip/#301 — Juggle winner-banner pad/margin leftovers.
 * Wave59/62 locked gold gradient + font-size; deepen pad/margin. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 63 juggle — inject winner pad margin', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects winner-banner padding 1.5rem and margin 1rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(
      /\.juggle-winner-banner\s*\{[^}]*padding:\s*1\.5rem/
    );
    expect(css).toMatch(/\.juggle-winner-banner\s*\{[^}]*margin:\s*1rem/);
  });
});
