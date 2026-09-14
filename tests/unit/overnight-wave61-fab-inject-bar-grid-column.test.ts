/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab bar-grid column gap.
 * Wave58 pins bar-group wrap; deepen bar-grid column leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject bar-grid column', () => {
  it('bar-grid is column with 0.75rem gap', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-bar-grid');
    expect(css).toContain('flex-direction: column');
    expect(css).toContain('gap: 0.75rem');
  });
});
