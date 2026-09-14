/**
 * Wave 60 leftover after tip/#279 — Juggle preview valid/invalid RGBA tokens.
 * Wave55 locked class names only. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 60 juggle — inject preview rgba', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('embeds exact preview-valid and preview-invalid RGBA fills', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toContain('rgba(76, 175, 80, 0.5)');
    expect(css).toContain('rgba(239, 83, 80, 0.5)');
  });
});
