/**
 * Wave 66 leftover after tip/#316 — Fab op-disabled opacity+cursor scoped.
 * Wave59 soft class; lock opacity/cursor leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 66 fab — inject op-disabled opacity cursor scoped', () => {
  it('op-disabled is opacity 0.4 with not-allowed cursor', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toMatch(
      /\.fab-op-disabled\s*\{[\s\S]*?opacity:\s*0\.4[\s\S]*?cursor:\s*not-allowed/
    );
  });
});
