/**
 * Overnight TOKENMAXX HEAVY leftovers after #285 — Fab controls gap.
 * Wave54 pins controls selector; deepen gap/justify leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 61 fab — inject controls gap', () => {
  it('controls are centered with 1rem gap', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-controls');
    expect(css).toContain('justify-content: center');
    expect(css).toContain('gap: 1rem');
  });
});
