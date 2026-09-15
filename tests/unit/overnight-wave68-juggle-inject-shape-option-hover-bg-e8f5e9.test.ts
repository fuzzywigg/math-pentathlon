/**
 * Wave 68 leftover after tip/#333 — shape-option hover bg e8f5e9.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 68 juggle — inject shape option hover bg e8f5e9', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects shape-option hover background #e8f5e9', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/\.juggle-shape-option:hover\s*\{[^}]*background:\s*#e8f5e9/);
  });
});
