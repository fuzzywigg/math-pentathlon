/**
 * Wave 64 leftover after #305 — Fab bar-group 0.5rem pad.
 * Wave58 pins wrapper padding 4px; deepen bar-group 0.5rem leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 64 fab — inject bar-group pad', () => {
  it('bar-group uses 0.5rem padding with 0.5rem gap', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-bar-group');
    expect(css).toContain('padding: 0.5rem');
    expect(css).toContain('gap: 0.5rem');
  });
});
