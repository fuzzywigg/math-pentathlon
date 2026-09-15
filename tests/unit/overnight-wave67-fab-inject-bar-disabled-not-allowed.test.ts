/**
 * Wave 67 leftover after tip/#336 — Fab bar-disabled not-allowed cursor.
 * Soft disabled class; lock cursor leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject bar-disabled not-allowed', () => {
  it('bar-disabled uses cursor not-allowed', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-bar-disabled\s*\{[\s\S]*?cursor:\s*not-allowed/
    );
  });
});
