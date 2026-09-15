/**
 * Wave 67 leftover after tip/#336 — Fab main-layout 1fr 300px.
 * Wave59 gap soft; lock grid 1fr 300px leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject main-layout 1fr 300', () => {
  it('main-layout is 1fr 300px grid', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-main-layout\s*\{[\s\S]*?grid-template-columns:\s*1fr 300px/
    );
  });
});
