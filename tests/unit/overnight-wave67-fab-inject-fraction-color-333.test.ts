/**
 * Wave 67 leftover after tip/#316 — Fab fraction color #333.
 * Soft fraction class; lock #333 leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject fraction color 333', () => {
  it('fraction uses #333', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(/\.fab-fraction\s*\{[\s\S]*?color:\s*#333/);
  });
});
