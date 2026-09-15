/**
 * Wave 66 leftover after tip/#316 — Juggle inject shape-name size.
 * Soft layout existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 66 juggle — inject shape name fontsize', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects shape-name font-size 0.75rem', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.shape-name\s*\{[^}]*font-size:\s*0\.75rem/);
  });
});
