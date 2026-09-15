/**
 * Wave 66 leftover after tip/#316 — Fab btn-secondary #e0e0e0 scoped.
 * Wave59 soft fills; lock .fab-btn-secondary leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject btn-secondary e0 scoped', () => {
  it('secondary button fills #e0e0e0', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-btn-secondary\s*\{[\s\S]*?background:\s*#e0e0e0/
    );
  });
});
