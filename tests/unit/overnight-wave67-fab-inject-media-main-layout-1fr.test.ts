/**
 * Wave 67 leftover after tip/#316 — Fab media main-layout 1fr.
 * Wave56 soft mobile 1fr; lock media query leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject media main-layout 1fr', () => {
  it('768px media collapses main-layout to 1fr', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /@media \(max-width: 768px\)[\s\S]*?\.fab-main-layout\s*\{[\s\S]*?grid-template-columns:\s*1fr/
    );
  });
});
