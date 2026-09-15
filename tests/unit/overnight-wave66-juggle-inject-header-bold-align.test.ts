/**
 * Wave 66 leftover after tip/#316 — Juggle inject header bold align.
 * Soft layout existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 66 juggle — inject header bold align', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects board-header bold and align-items center', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-board-header\s*\{[^}]*font-weight:\s*bold/);
    expect(css).toMatch(/\.juggle-board-header\s*\{[^}]*align-items:\s*center/);
  });
});
