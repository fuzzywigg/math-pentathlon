/**
 * Wave 65 leftover after tip/#315 — Juggle inject .shape-name CSS.
 * DOM .shape-name text queried (wave59); inject CSS never. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 65 juggle — inject shape name css', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects .shape-name font-size 0.75rem + color #666', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.shape-name\s*\{[^}]*font-size:\s*0\.75rem/);
    expect(css).toMatch(/\.shape-name\s*\{[^}]*color:\s*#666/);
  });
});
