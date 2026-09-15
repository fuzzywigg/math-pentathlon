/**
 * Wave 67 leftover after tip/#323/#324 — shape-header align + weight.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject shape-header align weight', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects shape-header center + weight 500', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-shape-header\s*\{[^}]*text-align:\s*center/);
    expect(css).toMatch(/\.juggle-shape-header\s*\{[^}]*font-weight:\s*500/);
  });
});
