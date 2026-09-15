/**
 * Wave 64 leftover after #305 — Fab btn-primary seat background var.
 * Wave63 pins border none + white; deepen background seat var leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 64 fab — inject btn-primary bg var', () => {
  it('btn-primary fills with player1 seat color var', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-btn-primary');
    expect(css).toContain('background: var(--color-player1, #2196f3)');
  });
});
