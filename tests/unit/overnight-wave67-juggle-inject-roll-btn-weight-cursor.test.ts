/**
 * Wave 67 leftover after tip/#323/#324 — roll-btn weight bold + cursor.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 67 juggle — inject roll-btn weight cursor', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects roll-btn font-weight bold and pointer cursor', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-roll-btn\s*\{[^}]*font-weight:\s*bold/);
    expect(css).toMatch(/\.juggle-roll-btn\s*\{[^}]*cursor:\s*pointer/);
  });
});
