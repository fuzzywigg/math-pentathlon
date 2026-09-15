/**
 * Wave 68 leftover after tip/#333 — preview-valid rgba scoped.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 68 juggle — inject preview valid rgba scoped', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects preview-valid rgba fill scoped', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-cell\.preview-valid\s*\{[^}]*background:\s*rgba\(76, 175, 80, 0\.5\)/);
  });
});
