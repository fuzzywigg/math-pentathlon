/**
 * Wave 67 leftover after tip/#336 — Fab move-num bold + margin.
 * Soft move-num; lock bold + margin-right leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject move-num bold margin', () => {
  it('move-num is bold with margin-right 0.5rem', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-move-num\s*\{[\s\S]*?font-weight:\s*bold[\s\S]*?margin-right:\s*0\.5rem/
    );
  });
});
