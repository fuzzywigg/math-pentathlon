/**
 * Wave 68 leftover after tip/#333 — grid padding 1px.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 68 juggle — inject grid padding 1px', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects grid padding 1px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-grid\s*\{[^}]*padding:\s*1px/);
  });
});
