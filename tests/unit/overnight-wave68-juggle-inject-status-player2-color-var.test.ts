/**
 * Wave 68 leftover after tip/#333 — status player2 color var.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 68 juggle — inject status player2 color var', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects status.player2 color var fallback', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-status\.player2\s*\{[^}]*color:\s*var\(--color-player2, #f44336\)/);
  });
});
