/**
 * Wave 66 leftover after tip/#316 — Fab section-header border-bottom scoped.
 * Wave59/63 soft type/pad; lock #e0e0e0 border leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject section-header border scoped', () => {
  it('section-header uses 2px #e0e0e0 bottom border', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-section-header\s*\{[\s\S]*?border-bottom:\s*2px solid #e0e0e0/
    );
  });
});
