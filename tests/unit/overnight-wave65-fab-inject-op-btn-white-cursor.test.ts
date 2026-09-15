/**
 * Wave 65 leftover after tip/#305 — Fab op-btn white + cursor pointer.
 * Soft op pad existed; lock white bg + cursor leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 65 fab — inject op btn white cursor', () => {
  it('op-btn uses white background and pointer cursor', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-op-btn\s*\{[\s\S]*?background:\s*white[\s\S]*?cursor:\s*pointer/
    );
  });
});
