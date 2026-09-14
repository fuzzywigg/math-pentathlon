/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab scores row padding.
 * Wave58 pins scores gap; deepen padding 0.75rem leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 63 fab — inject scores pad', () => {
  it('scores row uses 0.75rem padding', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-scores');
    expect(css).toContain('padding: 0.75rem');
  });
});
