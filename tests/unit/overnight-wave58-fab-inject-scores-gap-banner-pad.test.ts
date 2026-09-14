/**
 * Overnight TOKENMAXX HEAVY leftovers after #271 — Fab scores gap + winner padding.
 * Wave57 covered gradient/vars; deepen gap/padding chrome. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 58 fab — inject scores gap banner pad', () => {
  it('scores use 2rem gap and winner banner pads 1.5rem', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-scores');
    expect(css).toContain('gap: 2rem');
    expect(css).toContain('.fab-winner-banner');
    expect(css).toContain('padding: 1.5rem');
  });
});
