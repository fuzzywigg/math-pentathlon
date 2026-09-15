/**
 * Wave 68 leftover after tip/#333 — winner gradient ffd700.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 68 juggle — inject winner gradient ffd700', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects winner-banner gold gradient', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-winner-banner\s*\{[^}]*background:\s*linear-gradient\(135deg, #ffd700, #ffec8b\)/);
  });
});
