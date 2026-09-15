/**
 * Wave 67 leftover after tip/#323/#324 — winner-banner radius + align.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject winner radius align', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects winner-banner radius 8px and text-align center', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-winner-banner\s*\{[^}]*border-radius:\s*8px/);
    expect(css).toMatch(/\.juggle-winner-banner\s*\{[^}]*text-align:\s*center/);
    expect(css).toMatch(/\.juggle-winner-banner\s*\{[^}]*font-weight:\s*bold/);
  });
});
