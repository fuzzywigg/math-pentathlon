/**
 * Wave 64 leftover after tip/#301 + open #303 wave63 — Juggle shape-name typography.
 * Distinct from wave62 die-label #666. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 64 juggle — inject shape-name typography', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects shape-name 0.75rem and #666', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.shape-name\s*\{[^}]*font-size:\s*0\.75rem/);
    expect(css).toMatch(/\.shape-name\s*\{[^}]*color:\s*#666/);
  });
});
