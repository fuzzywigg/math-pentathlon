/**
 * Wave 67 leftover after tip/#316 — Fab op-disabled opacity 0.4.
 * Wave59 op-disabled class soft; lock opacity leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 67 fab — inject op-disabled opacity 0.4', () => {
  it('op-disabled sets opacity 0.4 and not-allowed', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-op-disabled\s*\{[\s\S]*?opacity:\s*0\.4[\s\S]*?cursor:\s*not-allowed/
    );
  });
});
