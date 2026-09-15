/**
 * Wave 68 leftover after tip/#333 — media cell width 24px.
 * Soft inject existed; lock selector-scoped leftover. Tests-only.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { injectJuggleStyles } from '../../src/games/juggle/board-ui';

describe('Wave 68 juggle — inject media cell width 24', () => {
  beforeEach(() => {
    document.getElementById('juggle-styles')?.remove();
  });

  it('injects media-query cell width 24px', () => {
    injectJuggleStyles();
    const css = document.getElementById('juggle-styles')?.textContent ?? '';
    expect(css).toMatch(/@media \(max-width: 700px\)[\s\S]*?\.juggle-cell\s*\{[^}]*width:\s*24px/);
  });
});
