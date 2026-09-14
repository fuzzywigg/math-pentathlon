/**
 * Overnight TOKENMAXX HEAVY leftovers after #278 — FIAR board svg filter selector.
 * Wave57 asserts drop-shadow args; deepen .fiar-board-container svg target. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFiarStyles } from '../../src/games/fiar/board-ui';

afterEach(() => {
  document.getElementById('fiar-styles')?.remove();
});

describe('Wave 59 fiar — inject board svg filter', () => {
  it('svg under board-container gets drop-shadow filter', () => {
    injectFiarStyles();
    const css = document.getElementById('fiar-styles')!.textContent || '';
    expect(css).toContain('.fiar-board-container svg');
    expect(css).toContain(
      'filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
    );
  });
});
