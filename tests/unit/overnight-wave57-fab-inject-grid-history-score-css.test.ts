/**
 * Wave 57 leftover after #257 — Fab inject grid/history/score CSS tokens. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 57 fab — inject grid history score css', () => {
  it('includes answer-grid minmax, history overflow, score size, border', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('border-bottom: 2px solid #e0e0e0');
    expect(css).toContain('minmax(90px, 1fr)');
    expect(css).toContain('font-size: 1.25rem');
    expect(css).toContain('overflow-y: auto');
  });
});
