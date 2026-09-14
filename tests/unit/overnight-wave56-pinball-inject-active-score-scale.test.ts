/**
 * Overnight TOKENMAXX HEAVY leftovers after #256 — Pinball active score scale.
 * Tests-only.
 */
import { describe, it, expect, afterEach } from 'vitest';
import { injectFractionPinballStyles } from '../../src/games/fraction-pinball/board-ui';

afterEach(() => {
  document.getElementById('fraction-pinball-styles')?.remove();
});

describe('Wave 56 pinball inject — active score scale', () => {
  it('active score uses scale(1.05) leftover', () => {
    injectFractionPinballStyles();
    const css =
      document.getElementById('fraction-pinball-styles')!.textContent || '';
    expect(css).toContain('.pinball-player-score.active');
    expect(css).toContain('transform: scale(1.05)');
  });
});
