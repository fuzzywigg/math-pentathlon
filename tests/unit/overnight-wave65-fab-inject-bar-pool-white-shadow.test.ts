/**
 * Wave 65 leftover after tip/#305 — Fab bar-pool white + soft shadow.
 * Soft layout existed; lock pool white bg + rgba shadow leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 65 fab — inject bar pool white shadow', () => {
  it('bar-pool uses white background and rgba(0,0,0,0.1) shadow', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-bar-pool\s*\{[\s\S]*?background:\s*white[\s\S]*?box-shadow:\s*0 2px 8px rgba\(0,0,0,0\.1\)/
    );
  });
});
