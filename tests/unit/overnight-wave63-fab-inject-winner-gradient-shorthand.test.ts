/**
 * Overnight TOKENMAXX HEAVY leftovers after #296 — Fab winner gradient shorthand.
 * FIAR uses 0%/100% stops; deepen fab shorthand #ffd700,#ffec8b leftover. Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFabStyles } from '../../src/games/fab-a-diffy/board-ui';

afterEach(() => {
  document.getElementById('fab-styles')?.remove();
});

describe('Wave 63 fab — inject winner gradient shorthand', () => {
  it('winner banner uses shorthand gold gradient without stop percents', () => {
    injectFabStyles();
    const css = document.getElementById('fab-styles')!.textContent || '';
    expect(css).toContain('.fab-winner-banner');
    expect(css).toContain('linear-gradient(135deg, #ffd700, #ffec8b)');
  });
});
