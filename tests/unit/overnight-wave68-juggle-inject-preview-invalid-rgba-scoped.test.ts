/**
 * Wave 68 leftover after tip/#333 — preview-invalid rgba scoped.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 68 juggle — inject preview invalid rgba scoped', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects preview-invalid rgba fill scoped', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-cell\.preview-invalid\s*\{[^}]*background:\s*rgba\(239, 83, 80, 0\.5\)/);
  });
});
