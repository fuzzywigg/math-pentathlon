/**
 * Wave 65 leftover after tip/#311–#313 (unit-only) — Juggle boards gap/justify.
 * Soft flex-wrap in #315; lock gap 2rem + justify-content center. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject boards gap justify', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-boards gap 2rem + justify-content center', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-boards\s*\{[^}]*gap:\s*2rem/);
    expect(css).toMatch(/\.juggle-boards\s*\{[^}]*justify-content:\s*center/);
  });
});
