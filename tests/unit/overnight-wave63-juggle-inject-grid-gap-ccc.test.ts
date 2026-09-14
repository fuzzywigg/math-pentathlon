/**
 * Wave 63 leftover after tip/#301 — Juggle grid gap + #ccc chrome.
 * Distinct from cell 28px size locks. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 63 juggle — inject grid gap ccc', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .juggle-grid gap 1px and background #ccc', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-grid\s*\{[^}]*gap:\s*1px/);
    expect(css).toMatch(/\.juggle-grid\s*\{[^}]*background:\s*#ccc/);
    expect(css).toMatch(/\.juggle-grid\s*\{[^}]*padding:\s*1px/);
  });
});
